import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { IChainConfig } from '../../shared/services/blockchain-config.service';
import { BlockchainConfigService } from '../../shared/services/blockchain-config.service';
import type { CreateRawEventDto } from './dto/create-raw-event.dto';
import { RawEvent } from './entities/raw-event.entity';

@Injectable()
export class RawEventsService {
  private blockchains: Record<string, IChainConfig>;
  constructor(
    @InjectRepository(RawEvent)
    private rawEventsRepository: Repository<RawEvent>,
    public readonly configService: BlockchainConfigService,
  ) {
    this.blockchains = this.configService.allBlockchainConfig;
  }

  createRawEvent(createRawEventDto: CreateRawEventDto): Promise<RawEvent> {
    const rawEvent = new RawEvent();
    rawEvent.block = createRawEventDto.block;
    rawEvent.log_index = createRawEventDto.log_index;
    rawEvent.transaction_hash = createRawEventDto.transaction_hash;
    rawEvent.data = createRawEventDto.data;
    rawEvent.chain = createRawEventDto.chain;
    if (createRawEventDto.handled) {
      rawEvent.handled = true;
    }
    return this.rawEventsRepository.save(rawEvent);
  }

  checkRawEvent(event: RawEvent): void {
    event.handled = true;
    void this.rawEventsRepository.save(event);
  }

  getRawEvents(chain: string): Promise<RawEvent[]> {
    return this.rawEventsRepository.find({
      where: { chain, handled: false },
      order: {
        block: 'ASC',
        log_index: 'ASC',
      },
    });
  }

  getRawEvent(id: string): Promise<RawEvent> {
    return this.rawEventsRepository.findOne({ id });
  }

  async getStartBlock(chain: string): Promise<number> {
    const { max } = await this.rawEventsRepository
      .createQueryBuilder()
      .select('MAX(block)', 'max')
      .where('chain = :chain', { chain })
      .getRawOne();

    if (!max) {
      return this.blockchains[chain].startBlock || 0;
    }
    return Number(max) + 1;
  }

  async checkIfEventExist(
    chain: string,
    blockNumber: number,
    logIndex: number,
    transactionHash: string,
  ): Promise<boolean> {
    const foundEvent = await this.rawEventsRepository.findOne({
      where: {
        chain,
        block: blockNumber,
        log_index: logIndex,
        transaction_hash: transactionHash,
      },
    });
    return !!foundEvent;
  }
}
