import { Test, TestingModule } from '@nestjs/testing';
import { RawEventsController } from './raw-events.controller';
import { RawEventsService } from './raw-events.service';

describe('RawEventsController', () => {
  let controller: RawEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawEventsController],
      providers: [RawEventsService],
    }).compile();

    controller = module.get<RawEventsController>(RawEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
