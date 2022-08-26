import { ApiProperty } from '@nestjs/swagger';

import { AssetType } from '../../../common/constants/asset-type.enum';
import { TokenType } from '../../../common/constants/token-type.enum';
import { User } from '../../user/entities/user.entity';

export class CreateAssetDto {
  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  animation_url: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  properties: string;

  @ApiProperty()
  collection_id?: string;

  @ApiProperty()
  creator: User;

  @ApiProperty()
  chain_id: string;

  @ApiProperty()
  role: AssetType;

  @ApiProperty()
  type: TokenType;
}
