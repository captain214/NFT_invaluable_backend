import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AuctionsService } from './auctions.service';
import type { Auction } from './entities/auction.entity';
import type { AuctionEvent } from './entities/auction-event.entity';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @ApiOperation({ operationId: 'getAuction' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Auction> {
    const auction = await this.auctionsService.findOne(id);
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  @ApiOperation({ operationId: 'getAuctionBids' })
  @Get(':id/bids')
  async getAuctionBids(
    @Param('id') id: string,
  ): Promise<{ count: number; bids: AuctionEvent[] }> {
    const [bids, count] = await this.auctionsService.getAuctionBids(id);
    return { count, bids };
  }
}
