import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sub } from 'date-fns';
import { LessThan, Repository } from 'typeorm';

import { SetItemStatus } from '../../common/constants/set-item-status.enum';
import { randomBetween } from '../../utils/math';
import type { CreateUniqueSetDto } from './dto/create-unique-set.dto';
import { UniqueSet } from './entities/unique-set.entity';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const PENDING_TIME = 5; // in minutes
@Injectable()
export class UniqueSetsService {
  private readonly logger = new ConsoleLogger();
  private readonly reservedQuota = 0.1;
  private readonly itemsQuantityForUserLimit = 20;
  constructor(
    @InjectRepository(UniqueSet)
    private uniqueSetRepository: Repository<UniqueSet>,
  ) {
    void this.freePendingItems();
  }

  async createUniqueSet(
    createUniqueSetDto: CreateUniqueSetDto,
  ): Promise<UniqueSet[]> {
    const uniqueSets = createUniqueSetDto.token_uri_list.map((uri) => {
      const set = new UniqueSet();
      set.action_name = createUniqueSetDto.action_name;
      set.show_time = createUniqueSetDto.show_time;
      set.token_uri = uri;
      return set;
    });
    const savedSets = await this.uniqueSetRepository.save(uniqueSets);
    const reservedSetsIds: string[] = [];
    const reservedQuantity = Math.ceil(uniqueSets.length * this.reservedQuota);

    while (reservedSetsIds.length < reservedQuantity) {
      const randomPos = randomBetween(0, savedSets.length - 1);
      const randomSet = savedSets[randomPos];
      if (reservedSetsIds.includes(randomSet.id)) {
        continue;
      }
      reservedSetsIds.push(randomSet.id);
    }

    await this.uniqueSetRepository
      .createQueryBuilder()
      .update()
      .set({ status: SetItemStatus.RESERVED })
      .where('id IN (:...sets)', { sets: reservedSetsIds })
      .execute();
    return savedSets.map((i) =>
      reservedSetsIds.includes(i.id)
        ? { ...i, status: SetItemStatus.RESERVED }
        : i,
    );
  }

  async getFreeItems(): Promise<UniqueSet[]> {
    return this.uniqueSetRepository.find({ status: SetItemStatus.FREE });
  }

  async changeStatus(id: string, status: SetItemStatus): Promise<UniqueSet> {
    const item = await this.uniqueSetRepository.findOne(id);
    if (!item) {
      throw new NotFoundException('item not found');
    }
    item.status = status;
    return this.uniqueSetRepository.save(item);
  }

  async markItemUsed(id: string, assetId: string): Promise<UniqueSet> {
    const item = await this.uniqueSetRepository.findOne(id);
    if (!item) {
      throw new NotFoundException('item not found');
    }
    item.status = SetItemStatus.USED;
    item.assetId = assetId;
    return this.uniqueSetRepository.save(item);
  }

  private async getUserItems(user: string): Promise<UniqueSet[]> {
    return this.uniqueSetRepository.find({
      creator: user,
    });
  }

  async getUserItemsCount(user: string): Promise<number> {
    const totalCnt = (await this.getFreeItems()).length;
    if (totalCnt === 0) {
      return 0;
    }
    const availableCnt =
      this.itemsQuantityForUserLimit - (await this.getUserItems(user)).length;

    return Number(availableCnt > totalCnt ? totalCnt : availableCnt);
  }

  async getItemsToMint(user: string, quantity: number): Promise<string[]> {
    const response: string[] = [];
    const usedItemsQuantity = await this.getUserItems(user);
    const availableItemsQuantity =
      this.itemsQuantityForUserLimit - usedItemsQuantity.length;
    if (availableItemsQuantity === 0) {
      return response;
    }
    quantity =
      quantity < availableItemsQuantity ? quantity : availableItemsQuantity;

    for (let i = 0; i < quantity; i++) {
      const freeItems = await this.getFreeItems();
      const freeQuantity = freeItems.length;
      if (freeQuantity === 0) {
        return response;
      }
      const randomItem = randomBetween(0, freeQuantity);

      const itemToMint = freeItems[randomItem];
      itemToMint.creator = user;
      itemToMint.status = SetItemStatus.PENDING;
      await this.uniqueSetRepository.save(itemToMint);
      setTimeout(() => {
        void this.freePendingItem(itemToMint.id);
      }, PENDING_TIME * 60 * 1000);
      response.push(itemToMint.token_uri);
    }
    return response;
  }

  async freePendingItem(id: string): Promise<void> {
    const item = await this.uniqueSetRepository.findOne(id);
    if (item.status === SetItemStatus.PENDING) {
      item.status = SetItemStatus.FREE;
      item.creator = NULL_ADDRESS;
      await this.uniqueSetRepository.save(item);
    }
  }

  async freePendingItems(): Promise<UniqueSet[]> {
    const date = sub(new Date(), { minutes: PENDING_TIME });
    const items = await this.uniqueSetRepository.find({
      status: SetItemStatus.PENDING,
      updated_at: LessThan(date),
    });
    for (const item of items) {
      item.status = SetItemStatus.FREE;
      item.creator = NULL_ADDRESS;
      await this.uniqueSetRepository.save(item);
    }
    return items;
  }

  async checkIsEndOfMinting(): Promise<boolean> {
    const items = await this.uniqueSetRepository.find({
      where: [
        { status: SetItemStatus.FREE },
        { status: SetItemStatus.PENDING },
      ],
    });
    return items.length === 0;
  }
}
