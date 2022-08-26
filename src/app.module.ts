import './boilerplate.polyfill';

import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { contextMiddleware } from './middlewares';
import { AssetModule } from './modules/asset/asset.module';
import { AuthModule } from './modules/auth/auth.module';
import { BalancesModule } from './modules/balances/balances.module';
import { BlockchainsModule } from './modules/blockchains/blockchains.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { EventListenerModule } from './modules/event-listener/event-listener.module';
import { EventsModule } from './modules/events/events.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PostModule } from './modules/post/post.module';
import { RawEventsModule } from './modules/raw-events/raw-events.module';
import { TokenModule } from './modules/token/token.module';
import { UniqueSetsModule } from './modules/unique-sets/unique-sets.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.typeOrmConfig,
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
    CollectionsModule,
    AssetModule,
    EventsModule,
    OrdersModule,
    TokenModule,
    EventListenerModule,
    BlockchainsModule,
    BalancesModule,
    RawEventsModule,
    UniqueSetsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
