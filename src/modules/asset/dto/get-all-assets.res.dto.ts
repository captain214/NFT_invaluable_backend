import { ApiProperty } from '@nestjs/swagger';

import type { Asset } from '../entities/asset.entity';

export class GetAllAssetsResDto {
  @ApiProperty()
  assets: Asset[];

  @ApiProperty()
  count: number;
}
