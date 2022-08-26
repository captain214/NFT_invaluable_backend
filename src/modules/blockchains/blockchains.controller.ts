import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { FindConditions } from 'typeorm';

import { MetaAuthGuard } from '../../guards/meta-auth.guard';
import { BlockchainsService } from './blockchains.service';
import { CreateBlockchainDto } from './dto/create-blockchain.dto';
import { GetStartBlockDto } from './dto/get-start-block.dto';
import { SecureCreateBlockchainDto } from './dto/secure-create-blockchain.dto';
import { UpdateBlockchainDto } from './dto/update-blockchain.dto';
import { Blockchain } from './entities/blockchain.entity';

@ApiTags('blockchains')
@Controller('blockchains')
export class BlockchainsController {
  constructor(private readonly blockchainsService: BlockchainsService) {}

  @ApiOperation({ operationId: 'createBlockchain' })
  @ApiResponse({ type: Blockchain, status: 201 })
  @Post()
  @UseGuards(MetaAuthGuard)
  createBlockchain(
    @Body() createBlockchainDto: SecureCreateBlockchainDto,
  ): Promise<Blockchain> {
    return this.blockchainsService.createBlockchain(
      createBlockchainDto.payload,
    );
  }

  @ApiOperation({ operationId: 'getStartBlock' })
  @ApiResponse({ type: Number, status: 200 })
  @Get('start-block')
  async getStartBlock(
    @Query() getStartBlockDto: GetStartBlockDto,
  ): Promise<number> {
    const findConditions: FindConditions<Blockchain> = {};
    findConditions.name = getStartBlockDto.name;
    findConditions.address = getStartBlockDto.address;

    const blockchain = await this.blockchainsService.getBlockchain(
      findConditions,
    );
    if (!blockchain) {
      throw new NotFoundException(
        'blockchain getStartBlock: There is no such combination chain/address',
      );
    }
    return blockchain.start_block;
  }

  // @ApiOperation({ operationId: 'updateStartBlock' })
  // @ApiResponse({ type: Blockchain, status: 201 })
  // @Put('start-block')
  // updateStartBlock(
  //   @Body() updateStartBlockDto: UpdateBlockchainDto,
  // ): Promise<Blockchain> {
  //   return this.blockchainsService.updateBlockchain(updateStartBlockDto);
  // }
}
