import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CollectionsService } from './collections.service';
import type { CollectionsResDto } from './dto/collections.res.dto';
import { CreateCollectionReqDto } from './dto/create-collection.req.dto';
import { Collection } from './entities/collection.entity';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @ApiOperation({ operationId: 'createCollection' })
  @ApiResponse({ type: Collection, status: 201 })
  @Post()
  async create(
    @Body() createCollectionReqDto: CreateCollectionReqDto,
  ): Promise<Collection> {
    return this.collectionsService.createCollection(createCollectionReqDto);
  }

  @ApiOperation({ operationId: 'getCollection' })
  @ApiResponse({ type: Collection, status: 200 })
  @Get(':slug')
  async getCollection(@Param('slug') id: string): Promise<Collection> {
    const res = await this.collectionsService.getCollection(id);
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  @ApiOperation({ operationId: 'getAllCollections' })
  @Get()
  async getAllCollections(): Promise<CollectionsResDto> {
    const [collections, count] =
      await this.collectionsService.getAllCollections();

    return { collections, count };
  }
}
