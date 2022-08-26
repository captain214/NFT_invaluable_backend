import { ApiProperty } from '@nestjs/swagger';

export class SetPriceDto {
  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  tokenId?: number;

  @ApiProperty({ required: false })
  assetId?: string;

  @ApiProperty()
  price: number;
}
