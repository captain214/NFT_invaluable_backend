import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindConditions } from 'typeorm';
import { Repository } from 'typeorm';

import type { CreateBlockchainDto } from './dto/create-blockchain.dto';
import type { UpdateBlockchainDto } from './dto/update-blockchain.dto';
import { Blockchain } from './entities/blockchain.entity';

@Injectable()
export class BlockchainsService {
  constructor(
    @InjectRepository(Blockchain)
    private blockchainRepository: Repository<Blockchain>,
  ) {}

  createBlockchain(
    createBlockchainDto: CreateBlockchainDto,
  ): Promise<Blockchain> {
    const blockchain = new Blockchain();
    blockchain.name = createBlockchainDto.name;
    blockchain.address = createBlockchainDto.address;
    blockchain.start_block = createBlockchainDto.start_block || 0;
    return this.blockchainRepository.save(blockchain);
  }

  getBlockchain(conditions: FindConditions<Blockchain>): Promise<Blockchain> {
    return this.blockchainRepository.findOne({ where: conditions });
  }

  async getStartBlock(conditions: FindConditions<Blockchain>): Promise<number> {
    const blockchain = await this.blockchainRepository.findOne({
      where: conditions,
    });
    if (!blockchain) {
      return 0;
    }
    return blockchain.start_block + 1;
  }

  // async updateBlockchain(
  //   updateStartBlockDto: UpdateBlockchainDto,
  // ): Promise<Blockchain> {
  //   const findConditions: FindConditions<Blockchain> = {};
  //   findConditions.name = updateStartBlockDto.name;
  //   findConditions.address = updateStartBlockDto.address;
  //   let blockchain = await this.blockchainRepository.findOne({
  //     where: findConditions,
  //   });
  //   if (!blockchain) {
  //     // throw new NotFoundException(
  //     //   'blockchain updateBlockchain: There is no such combination chain/address',
  //     // );
  //     blockchain = new Blockchain();
  //     blockchain.name = updateStartBlockDto.name;
  //     blockchain.address = updateStartBlockDto.address;
  //   }
  //   blockchain.start_block = updateStartBlockDto.start_block;
  //   return this.blockchainRepository.save(blockchain);
  // }

  // async updateStartBlock(
  //   chain: string,
  //   address: string,
  //   block: number,
  // ): Promise<void> {
  //   const startBlock = await this.getStartBlock({ name: chain, address });
  //   if (block > startBlock) {
  //     await this.updateBlockchain({
  //       name: chain,
  //       address,
  //       start_block: block,
  //     });
  //   }
  // }
}
