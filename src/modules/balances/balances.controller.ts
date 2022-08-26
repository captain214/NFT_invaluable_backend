import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { Balance } from './entities/balance.entity';

@ApiTags('balances')
@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @ApiOperation({ operationId: 'changeOwner' })
  @ApiResponse({ status: 200, type: Balance })
  @Get()
  changeOwner(): Promise<Balance> {
    const balance = {
      tokenId: 0,
      address: '0xE37e7bf07e8C7c755E17e46a4a4987009716e784',
      owner: '0x00e6c7FA0346E43c78f1B5bfccb5027a70F9ee43',
    };
    return this.balancesService.changeOwner(balance);
  }
}
