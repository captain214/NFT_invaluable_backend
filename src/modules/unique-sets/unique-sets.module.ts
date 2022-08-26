import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UniqueSet } from './entities/unique-set.entity';
import { UniqueSetsController } from './unique-sets.controller';
import { UniqueSetsService } from './unique-sets.service';

@Module({
  imports: [TypeOrmModule.forFeature([UniqueSet])],
  controllers: [UniqueSetsController],
  providers: [UniqueSetsService],
  exports: [UniqueSetsService],
})
export class UniqueSetsModule {}
