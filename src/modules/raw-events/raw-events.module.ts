import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RawEvent } from './entities/raw-event.entity';
import { RawEventsController } from './raw-events.controller';
import { RawEventsService } from './raw-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([RawEvent])],
  controllers: [RawEventsController],
  providers: [RawEventsService],
  exports: [RawEventsService],
})
export class RawEventsModule {}
