import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsService } from './auctions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionEvent } from './entities/auction-event.entity';

describe('AuctionsService', () => {
  let service: AuctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Auction, AuctionEvent])
      ],
      providers: [AuctionsService],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
  });

  it('AuctionsService should be defined', async () => {
    const result = await service.updateByAddress('0x7b232898FEB3DF6cd5F3fB82a477e36ae34fcEda', { cancelled: true });
    console.log(result);
  });
});
