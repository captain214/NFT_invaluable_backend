import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Asset } from '../../modules/asset/entities/asset.entity';
import type { CreateEventReqDto } from './dto/create-event.req.dto';
import type { GetEventsReqDto } from './dto/get-events.req.dto';
import { EventLog } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventLog)
    private eventRepository: Repository<EventLog>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async createEvent(createEventReqDto: CreateEventReqDto): Promise<EventLog> {
    const event = new EventLog();
    const asset = await this.assetRepository.findOne({
      id: createEventReqDto.asset_id,
    });
    if (!asset) {
      throw new NotFoundException(
        `asset with id ${createEventReqDto.asset_id} not found`,
      );
    }
    event.from_user = createEventReqDto.from_user;
    event.to_user = createEventReqDto.to_user;
    event.type = createEventReqDto.type;
    event.timestamp = createEventReqDto.timestamp;
    event.created_at = new Date(createEventReqDto.timestamp * 1000);
    event.asset = asset;
    if (createEventReqDto.price) {
      event.price = createEventReqDto.price;
    }
    if (createEventReqDto.quantity) {
      event.quantity = createEventReqDto.quantity;
    }

    return this.eventRepository.save(event);
  }

  getEvents(conditions: GetEventsReqDto): Promise<EventLog[]> {
    const { address, token_id, type, occurred_after } = conditions;
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.asset', 'asset')
      .leftJoinAndSelect('event.from_user', 'from_user')
      .leftJoinAndSelect('event.to_user', 'to_user');

    const where = [
      address && 'asset.address = :address',
      address && token_id && 'asset.token_id = :token_id',
      occurred_after && 'event.created_at > :occurred_after',
      type && 'event.type = :type',
    ];
    for (const i of where.filter(Boolean)) {
      qb.andWhere(i, { address, token_id, type, occurred_after });
    }

    qb.orderBy('event.created_at', 'DESC');
    return qb.getMany();
  }

  getEvent(id: string): Promise<EventLog> {
    return this.eventRepository.findOne(id);
  }
}
