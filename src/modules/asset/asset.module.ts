import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CollectionsModule } from '../../modules/collections/collections.module';
import { Collection } from '../../modules/collections/entities/collection.entity';
import { EventLog } from '../../modules/events/entities/event.entity';
import { Order } from '../../modules/orders/entities/order.entity';
import { UniqueSet } from '../../modules/unique-sets/entities/unique-set.entity';
import { UserModule } from '../../modules/user/user.module';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Asset } from './entities/asset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, Collection, EventLog, Order, UniqueSet]),
    CollectionsModule,
    UserModule,
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
