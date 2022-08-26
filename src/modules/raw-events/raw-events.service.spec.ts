import { Test, TestingModule } from '@nestjs/testing';
import { RawEventsService } from './raw-events.service';

describe('RawEventsService', () => {
  let service: RawEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawEventsService],
    }).compile();

    service = module.get<RawEventsService>(RawEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
