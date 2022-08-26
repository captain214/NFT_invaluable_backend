import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUniqueSetDto } from './dto/create-unique-set.dto';
import { GetAvailableCount } from './dto/get-available-count.dto';
import { GetItemsToMintReqDto } from './dto/get-items-to-mint.req.dto';
// import type { GetItemsToMintResDto } from './dto/get-items-to-mint.res.dto';
import type { UniqueSet } from './entities/unique-set.entity';
import { UniqueSetsService } from './unique-sets.service';

@ApiTags('unique set')
@Controller('unique-sets')
export class UniqueSetsController {
  constructor(private readonly uniqueSetsService: UniqueSetsService) {}

  @ApiOperation({ operationId: 'createUniqueSet' })
  @ApiResponse({ status: 201 })
  @Post()
  createUniqueSet(
    @Body() createUniqueSetDto: CreateUniqueSetDto,
  ): Promise<UniqueSet[]> {
    return this.uniqueSetsService.createUniqueSet(createUniqueSetDto);
  }

  @ApiOperation({ operationId: 'getItemsToMint' })
  @ApiResponse({ status: 200 })
  @Get('items')
  getItemsToMint(@Query() dto: GetItemsToMintReqDto): Promise<string[]> {
    return this.uniqueSetsService.getItemsToMint(dto.user, dto.quantity);
  }

  @ApiOperation({ operationId: 'getItemsToMint' })
  @ApiResponse({ status: 200 })
  @Get('available')
  getUserItemsCount(@Query() dto: GetAvailableCount): Promise<number> {
    return this.uniqueSetsService.getUserItemsCount(dto.user);
  }

  // @ApiOperation({ operationId: 'test' })
  // @ApiResponse({ status: 200 })
  // @Get('test')
  // test(): Promise<any> {
  //   return this.uniqueSetsService.checkIsEndOfMinting();
  // }
}
