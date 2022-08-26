import { Module } from '@nestjs/common';

import { AssetModule } from '../../modules/asset/asset.module';
import { BalancesModule } from '../../modules/balances/balances.module';
import { BlockchainsModule } from '../../modules/blockchains/blockchains.module';
import { EventsModule } from '../../modules/events/events.module';
import { OrdersModule } from '../../modules/orders/orders.module';
import { RawEventsModule } from '../../modules/raw-events/raw-events.module';
import { TokenModule } from '../../modules/token/token.module';
import { UniqueSetsModule } from '../../modules/unique-sets/unique-sets.module';
import { AuctionsModule } from '../auctions/auctions.module';
import { UserModule } from '../user/user.module';
import { AuctionEventsHandler } from './auction-events.handler';
import { EventListenerService } from './event-listener.service';

@Module({
  imports: [
    TokenModule,
    BlockchainsModule,
    AssetModule,
    EventsModule,
    BalancesModule,
    OrdersModule,
    RawEventsModule,
    UserModule,
    AuctionsModule,
    UniqueSetsModule,
  ],
  providers: [EventListenerService, AuctionEventsHandler],
})
export class EventListenerModule {}
