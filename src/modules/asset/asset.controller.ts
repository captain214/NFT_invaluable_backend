import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from '../../modules/user/user.service';
import { AssetService } from './asset.service';
import { GetAllAssetsDto } from './dto/get-all-assets.dto';
import type { GetAllAssetsResDto } from './dto/get-all-assets.res.dto';
import { UpdateFavoriteReqDto } from './dto/update-favorites.req.dto';
import { UpdateFavoriteResDto } from './dto/update-favorites.res.dto';
import { Asset } from './entities/asset.entity';

@ApiTags('assets')
@Controller('assets')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ operationId: 'getAllAssets' })
  @ApiResponse({ status: 200, type: Asset, isArray: true })
  @Get()
  async getAllAssets(
    @Query() dto: GetAllAssetsDto,
  ): Promise<GetAllAssetsResDto> {
    const [assets, count] = await this.assetService.getAssets(dto);
    return { assets, count };
  }

  @ApiOperation({ operationId: 'getAsset' })
  @Get(':address/:tokenId')
  async findOne(
    @Param('address') address: string,
    @Param('tokenId') tokenId: number,
  ): Promise<Asset> {
    const asset = await this.assetService.findOne(address, tokenId);
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }

  // @ApiOperation({ operationId: 'test' })
  // @ApiResponse({ status: 200 })
  // @Get('test')
  // test(): Promise<any> {
  //   return this.assetService.revealAll();
  // }

  @ApiResponse({ type: UpdateFavoriteResDto, status: 201 })
  @ApiOperation({ operationId: 'updateFavorites' })
  @Post('favorites')
  public async updateFavorites(
    @Body() dto: UpdateFavoriteReqDto,
  ): Promise<UpdateFavoriteResDto> {
    let user = await this.userService.getUserByAddress(dto.userAddress);
    let { favorites_count } = await this.assetService.getAssetById(dto.assetId);
    const favorites = new Set(user.favorites);
    if (favorites.has(dto.assetId)) {
      favorites.delete(dto.assetId);
      favorites_count--;
    } else {
      favorites.add(dto.assetId);
      favorites_count++;
    }
    user = await this.userService.setFavorites(dto.userAddress, [...favorites]);
    const asset = await this.assetService.setFavoriteCount(
      dto.assetId,
      favorites_count,
    );
    return { count: asset.favorites_count, favorites: user.favorites };
  }
}
