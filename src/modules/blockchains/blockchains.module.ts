import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../../modules/auth/auth.module';
import { BlockchainsController } from './blockchains.controller';
import { BlockchainsService } from './blockchains.service';
import { Blockchain } from './entities/blockchain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blockchain]), AuthModule],
  controllers: [BlockchainsController],
  providers: [BlockchainsService],
  exports: [BlockchainsService],
})
export class BlockchainsModule {}
