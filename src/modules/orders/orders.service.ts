import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindConditions } from 'typeorm';
import { Repository } from 'typeorm';

import { OrderStatus } from '../../common/constants/order-status.enum';
import { OrderType } from '../../common/constants/order-type.enum';
import { Asset } from '../../modules/asset/entities/asset.entity';
import { UserService } from '../../modules/user/user.service';
import type { AcceptOrderReqDto } from './dto/accept-order.req.dto';
import type { CreateOrderReqDto } from './dto/create-order.req.dto';
import type { GetOrdersReqDto } from './dto/get-orders.req.dto';
import type { GetOrdersForAssetReqDto } from './dto/get-orders-for-asset.req.dto';
import type { PendingOrderReqDto } from './dto/pending-order.req.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    public readonly userService: UserService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async createOrder(createOrderReqDto: CreateOrderReqDto): Promise<Order> {
    const order = new Order();
    const asset = await this.assetRepository.findOne({
      token_id: createOrderReqDto.token_id,
      address: createOrderReqDto.address,
    });
    if (!asset) {
      // throw new NotFoundException('asset not found');
      return;
    }
    order.asset = asset;
    order.price = createOrderReqDto.price;
    order.creator = createOrderReqDto.creator;
    if (createOrderReqDto.expiration_time) {
      order.expiration_time = createOrderReqDto.expiration_time;
    }
    if (createOrderReqDto.offer_id) {
      order.offer_id = createOrderReqDto.offer_id;
    }
    if (createOrderReqDto.taker) {
      order.taker = createOrderReqDto.taker;
    }
    if (createOrderReqDto.quantity) {
      order.quantity = createOrderReqDto.quantity;
    }
    order.type = createOrderReqDto.type;
    order.status = OrderStatus.ACTIVE;

    return this.orderRepository.save(order);
  }

  getOrder(id: string): Promise<Order> {
    return this.orderRepository.findOne(id);
  }

  getOrders(dto?: GetOrdersReqDto): Promise<Order[]> {
    const { address, token_id, collection_slug, limit = 10, offset = 0 } = dto;
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.asset', 'asset')
      .innerJoinAndSelect('asset.collection', 'collection');

    const where = [
      address && 'asset.address = :address',
      address && token_id && 'asset.token_id = :token_id',
      collection_slug && 'collection.slug = :collection_slug',
    ];
    for (const i of where.filter(Boolean)) {
      qb.andWhere(i, { address, token_id, collection_slug });
    }
    qb.orderBy('order.created_at', 'DESC');
    qb.limit(limit);
    qb.offset(offset);
    return qb.getMany();
  }

  getOrdersForAsset(
    getOrdersReqDto: GetOrdersForAssetReqDto,
  ): Promise<Order[]> {
    const where: FindConditions<Order> = {};

    if (getOrdersReqDto.asset_id) {
      where.asset = { id: getOrdersReqDto.asset_id };
    }

    if (
      (getOrdersReqDto.token_id || getOrdersReqDto.token_id === 0) &&
      getOrdersReqDto.address
    ) {
      where.asset = {
        token_id: getOrdersReqDto.token_id,
        address: getOrdersReqDto.address,
      };
    }

    if (getOrdersReqDto.status) {
      where.status = getOrdersReqDto.status;
    }

    if (getOrdersReqDto.offer_id) {
      where.offer_id = getOrdersReqDto.offer_id;
    }
    return this.orderRepository.find({
      relations: ['asset', 'creator'],
      where,
    });
  }

  async cancelOffer(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Offer with id ${id} not found!`);
    }
    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  async acceptOffer(acceptOrderReqDto: AcceptOrderReqDto): Promise<Order> {
    const order = await this.orderRepository.findOne(acceptOrderReqDto.id);
    if (!order) {
      throw new NotFoundException(
        `Offer with id ${acceptOrderReqDto.id} not found!`,
      );
    }
    // cancel other bids if auction
    if (order.type === OrderType.BID) {
      const otherBids = await this.orderRepository.find({
        relations: ['asset'],
        where: {
          asset: {
            id: order.asset.id,
          },
          type: OrderType.BID,
          status: OrderStatus.ACTIVE,
        },
      });
      for (const bid of otherBids) {
        void this.cancelOffer(bid.id);
      }
    }
    order.status = OrderStatus.ACCEPTED;
    order.taker = acceptOrderReqDto.taker;
    return this.orderRepository.save(order);
  }

  async expireOffer(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Offer with id ${id} not found!`);
    }
    order.status = OrderStatus.EXPIRED;
    return this.orderRepository.save(order);
  }

  async pendingOrder(pendingOrderReqDto: PendingOrderReqDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      relations: ['asset'],
      where: { id: pendingOrderReqDto.id },
    });
    if (!order) {
      throw new NotFoundException(
        `Offer with id ${pendingOrderReqDto.id} not found!`,
      );
    }
    if (order.quantity === pendingOrderReqDto.quantity) {
      order.status = OrderStatus.PENDING;
    } else {
      order.quantity -= pendingOrderReqDto.quantity;
      const pendingOrder = new Order();
      pendingOrder.asset = order.asset;
      pendingOrder.price = order.price;
      pendingOrder.expiration_time = order.expiration_time;
      pendingOrder.creator = order.creator;
      pendingOrder.type = order.type;
      pendingOrder.status = OrderStatus.PENDING;
      pendingOrder.quantity = pendingOrderReqDto.quantity;
      pendingOrder.offer_id = order.offer_id;
      await this.orderRepository.save(pendingOrder);
    }
    return this.orderRepository.save(order);
  }
}
