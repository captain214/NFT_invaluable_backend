import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Asset } from '../../modules/asset/entities/asset.entity';
import type { ChangeOwnerDto } from './dto/change-owner-balance.dto';
import type { CreateBalanceDto } from './dto/create-balance.dto';
import type { UpdateBalanceDto } from './dto/update-balance.dto';
import { Balance } from './entities/balance.entity';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Balance) private balanceRepository: Repository<Balance>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
  ) {}

  async createBalance(createBalanceDto: CreateBalanceDto): Promise<Balance> {
    const balance = new Balance();
    balance.user = createBalanceDto.user;
    balance.quantity = createBalanceDto.quantity;
    const asset = await this.assetRepository.findOne({
      id: createBalanceDto.asset_id,
    });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    balance.asset = asset;
    return this.balanceRepository.save(balance);
  }

  // for ERC721 token only
  async changeOwner(changeOwnerDto: ChangeOwnerDto): Promise<Balance> {
    const result = await this.balanceRepository.find({
      relations: ['asset'],
      where: {
        asset: {
          token_id: changeOwnerDto.tokenId,
          address: changeOwnerDto.address,
        },
      },
    });
    if (result.length !== 1 || result[0].quantity !== 1) {
      throw new Error('It is not ERC271 token balance');
    }
    const balance = result[0];
    balance.user = changeOwnerDto.user;

    return this.balanceRepository.save(balance);
  }

  async reduceBalance(reduceBalanceDto: UpdateBalanceDto): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      relations: ['asset'],
      where: {
        user: reduceBalanceDto.user,
        asset: {
          token_id: reduceBalanceDto.tokenId,
          address: reduceBalanceDto.address,
        },
      },
    });
    if (!balance) {
      throw new NotFoundException('Balance not found');
    }
    if (reduceBalanceDto.quantity > balance.quantity) {
      throw new Error('Balance quantity less than sold quantity');
    }
    if (reduceBalanceDto.quantity === balance.quantity) {
      return this.balanceRepository.remove(balance);
    }
    balance.quantity -= reduceBalanceDto.quantity;
    return this.balanceRepository.save(balance);
  }

  async increaseBalance(
    increaseBalanceDto: UpdateBalanceDto,
  ): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      relations: ['asset'],
      where: {
        user: increaseBalanceDto.user,
        asset: {
          token_id: increaseBalanceDto.tokenId,
          address: increaseBalanceDto.address,
        },
      },
    });
    if (!balance) {
      const asset = await this.assetRepository.findOne({
        token_id: increaseBalanceDto.tokenId,
        address: increaseBalanceDto.address,
      });
      return this.createBalance({
        asset_id: asset.id,
        user: increaseBalanceDto.user,
        quantity: increaseBalanceDto.quantity,
      });
    }
    balance.quantity += +increaseBalanceDto.quantity;
    return this.balanceRepository.save(balance);
  }
}
