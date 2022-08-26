import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuctionEventType } from '../../common/constants/auction-event-type.enum';
import type { CreateAuctionDto } from './dto/create-auction.dto';
import type { CreateAuctionEventDto } from './dto/create-auction-event.dto';
import type { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auction } from './entities/auction.entity';
import { AuctionEvent } from './entities/auction-event.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(AuctionEvent)
    private auctionEventRepository: Repository<AuctionEvent>,
  ) {}

  async createAuction(dto: CreateAuctionDto): Promise<Auction> {
    const found = await this.auctionRepository.findOne({
      address: dto.address,
    });
    if (found) {
      return found;
    }
    return this.auctionRepository.save({
      ...dto,
      asset: dto.asset && { id: dto.asset },
    });
  }

  async findOne(id: string): Promise<Auction> {
    return this.auctionRepository.findOne({
      where: { id },
      relations: ['asset'],
    });
  }

  async findOneByAddress(address: string): Promise<Auction> {
    return this.auctionRepository.findOne({
      where: { address },
      relations: ['asset'],
    });
  }

  async updateByAddress(
    address: string,
    dto: Partial<UpdateAuctionDto>,
  ): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { address },
    });
    return this.auctionRepository.save({
      ...auction,
      ...dto,
      asset: dto.asset && { id: dto.asset },
    });
  }

  async createAuctionEvent(dto: CreateAuctionEventDto): Promise<AuctionEvent> {
    return this.auctionEventRepository.save({
      ...dto,
      auction: { id: dto.auction },
      created_at: new Date(dto.created_at),
    });
  }

  async getAuctionBids(id: string): Promise<[AuctionEvent[], number]> {
    const result = await this.auctionEventRepository.query(
      `
      SELECT id, type, chain_id, t1.price, t1.from_account, created_at, auction_id FROM auction_events t1
        INNER JOIN (
          SELECT from_account, MAX(price) as price FROM auction_events
          WHERE type = $1 AND auction_id = $2
          GROUP BY from_account
        ) t2 ON t1.from_account = t2.from_account AND t1.price = t2.price AND t1.auction_id = $2
        ORDER BY t1.price DESC;
    `,
      [AuctionEventType.BID_PLACED, id],
    );
    return [result, result.length];
  }
}
