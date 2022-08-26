import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isFuture } from 'date-fns';
import type { FindConditions, OrderByCondition, UpdateResult } from 'typeorm';
import { MoreThan, Repository } from 'typeorm';

import { EventType } from '../../common/constants/event-type.enum';
import { OrderStatus } from '../../common/constants/order-status.enum';
import { OrderType } from '../../common/constants/order-type.enum';
import { SetItemStatus } from '../../common/constants/set-item-status.enum';
import { EventLog } from '../../modules/events/entities/event.entity';
import { Order } from '../../modules/orders/entities/order.entity';
import { UniqueSet } from '../../modules/unique-sets/entities/unique-set.entity';
import { Collection } from '../collections/entities/collection.entity';
import type { CreateAssetDto } from './dto/create-asset.dto';
import type { GetAllAssetsDto } from './dto/get-all-assets.dto';
import type { SetPriceDto } from './dto/set-price.dto';
import { Asset } from './entities/asset.entity';

const HIDDEN_ASSET = {
  title: 'Hidden asset',
  description: 'Hidden asset',
  image_url: 'https://pbs.twimg.com/media/EgDS7XjXkAEU2RR.jpg',
  properties: '',
  current_price: 0,
};

@Injectable()
export class AssetService {
  private readonly logger = new ConsoleLogger();
  constructor(
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(EventLog) private eventRepository: Repository<EventLog>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(UniqueSet)
    private uniqueSetRepository: Repository<UniqueSet>,
  ) {}

  checkAssetToShow(...assets: Asset[]): Asset[] {
    for (let asset of assets) {
      if (isFuture(asset.show_time)) {
        asset = Object.assign(asset, HIDDEN_ASSET);
      }
    }
    return assets;
  }

  async getAssets(dto: GetAllAssetsDto): Promise<[Asset[], number]> {
    const collections = dto.collection_slug ? [dto.collection_slug] : [];
    const order: OrderByCondition = dto.by
      ? { [`asset.${dto.by}`]: dto.direction }
      : { 'asset.created_at': 'ASC' };

    const qb = this.assetRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.collection', 'collection')
      .leftJoinAndSelect('asset.balances', 'balances')
      .leftJoinAndSelect('asset.orders', 'orders')
      .leftJoinAndSelect('balances.user', 'user')
      .leftJoinAndSelect('asset.auctions', 'auctions')
      .leftJoinAndSelect('auctions.events', 'events')
      .skip(dto.limit * dto.page || 0)
      .take(dto.limit)
      .orderBy(order);

    if (collections.length > 0) {
      qb.andWhere('collection.slug IN (:...collections)', {
        collections,
      });
    }

    if (dto.new) {
      const now = Math.floor(Date.now() / 1000);
      const yesterday = now - 60 * 60 * 24;
      const events = await this.eventRepository.find({
        relations: ['asset'],
        where: {
          type: EventType.CREATE,
          timestamp: MoreThan(yesterday),
        },
      });
      const assets = events.map((item) => item.asset.id);
      if (assets.length > 0) {
        qb.andWhere('asset.id IN (:...assets)', {
          assets,
        });
      } else {
        return [[], 0];
      }
    }

    if (dto.buy_now) {
      const orders = await this.orderRepository.find({
        relations: ['asset'],
        where: {
          type: OrderType.FIX_PRICE,
          status: OrderStatus.ACTIVE,
        },
      });
      const assets = orders.map((item) => item.asset.id);
      if (assets.length > 0) {
        qb.andWhere('asset.id IN (:...assets)', {
          assets,
        });
      } else {
        return [[], 0];
      }
    }

    if (dto.on_auction) {
      const orders = await this.orderRepository.find({
        relations: ['asset'],
        where: {
          type: OrderType.AUCTION,
          status: OrderStatus.ACTIVE,
        },
      });
      const assets = orders.map((item) => item.asset.id);
      if (assets.length > 0) {
        qb.andWhere('asset.id IN (:...assets)', {
          assets,
        });
      } else {
        return [[], 0];
      }
    }

    if (dto.search) {
      const search = `%${dto.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(asset.title) LIKE :search OR LOWER(asset.description) LIKE :search)',
        { search },
      );
    }

    if (dto.owner) {
      qb.andWhere('user.address = :user', { user: dto.owner });
    }

    if ('favorites' in dto) {
      if (dto.favorites !== '') {
        const assets = dto.favorites.split(',');
        qb.andWhere('asset.id IN (:...assets)', {
          assets,
        });
      } else {
        return [[], 0];
      }
    }

    return qb.getManyAndCount();
  }

  async findOne(address: string, tokenId: number): Promise<Asset> {
    return this.assetRepository.findOne({
      where: { address, token_id: tokenId },
      relations: ['collection', 'balances', 'balances.user', 'creator'],
    });
  }

  async getAssetById(assetId: string): Promise<Asset> {
    return this.assetRepository.findOne({
      where: { id: assetId },
      relations: ['collection', 'balances', 'balances.user', 'creator'],
    });
  }

  async createAsset(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = new Asset();
    asset.token_id = createAssetDto.tokenId;
    asset.address = createAssetDto.address;
    asset.title = createAssetDto.title;
    asset.description = createAssetDto.description;
    asset.image_url = createAssetDto.image_url;
    asset.animation_url = createAssetDto.animation_url;
    asset.creator = createAssetDto.creator;
    asset.type = createAssetDto.type;
    asset.chain_id = createAssetDto.chain_id;
    asset.role = createAssetDto.role;
    asset.properties = createAssetDto.properties;

    if (createAssetDto.collection_id) {
      asset.collection = await this.collectionRepository.findOne({
        id: createAssetDto.collection_id,
      });
    }

    return this.assetRepository.save(asset);
  }

  async setCurrentPrice(dto: SetPriceDto): Promise<Asset> {
    const where: FindConditions<Asset> = {};
    if (dto.assetId) {
      where.id = dto.assetId;
    }
    if (dto.address && (dto.tokenId || dto.tokenId === 0)) {
      where.address = dto.address;
      where.token_id = dto.tokenId;
    }
    const asset = await this.assetRepository.findOne({
      where,
    });
    if (!asset) {
      return;
    }
    asset.current_price = dto.price;
    return this.assetRepository.save(asset);
  }

  async setCurrentPriceFor1155(dto: SetPriceDto): Promise<Asset> {
    const where: FindConditions<Asset> = {};
    if (dto.assetId) {
      where.id = dto.assetId;
    }
    if (dto.address && (dto.tokenId || dto.tokenId === 0)) {
      where.address = dto.address;
      where.token_id = dto.tokenId;
    }
    const asset = await this.assetRepository.findOne({
      where,
    });
    const currentPrice = Number(asset.current_price);

    if (currentPrice === 0 || currentPrice > dto.price) {
      asset.current_price = dto.price;
    }
    if (!dto.price) {
      asset.current_price = await this.getMinPriceFor1155(asset.id);
    }
    return this.assetRepository.save(asset);
  }

  async getMinPriceFor1155(assetId: string): Promise<number> {
    const [{ minFixPrice }] = await this.orderRepository.query(
      ` SELECT MIN(price) AS "minFixPrice" FROM "orders"
        WHERE asset_id = '${assetId}' and status = 'ACTIVE';`,
    );
    return minFixPrice ? minFixPrice : 0;
  }

  async setShowTime(
    address: string,
    tokenId: number,
    showTime: string,
  ): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      address,
      token_id: tokenId,
    });
    asset.show_time = new Date(Number(showTime) * 1000);
    return this.assetRepository.save(asset);
  }

  async revealAll(): Promise<UpdateResult> {
    const response = await this.uniqueSetRepository.find({
      select: ['assetId'],
      where: { status: SetItemStatus.USED },
    });
    const assets = response.map((item) => item.assetId);
    return this.assetRepository
      .createQueryBuilder()
      .update(Asset)
      .set({ show_time: () => 'NOW()' })
      .where('id IN (:...assets)', {
        assets,
      })
      .execute();
  }

  async setFavoriteCount(assetId: string, count: number): Promise<Asset> {
    const asset = await this.getAssetById(assetId);
    asset.favorites_count = count;
    return this.assetRepository.save(asset);
  }
}
