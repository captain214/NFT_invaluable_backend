import { ApiProperty } from '@nestjs/swagger';

export class GetAllAssetsDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  limit: number;

  @ApiProperty({ required: false })
  collection_slug: string;

  // @ApiProperty({ required: false, isArray: true })
  // collections: string[];

  @ApiProperty({ required: false })
  by: string;

  @ApiProperty({ required: false })
  direction: 'ASC' | 'DESC';

  @ApiProperty({ required: false })
  new: boolean;

  @ApiProperty({ required: false })
  on_auction: boolean;

  @ApiProperty({ required: false })
  buy_now: boolean;

  @ApiProperty({ required: false })
  search: string;

  @ApiProperty({ required: false })
  owner: string;

  @ApiProperty({ required: false })
  favorites: string;
}
