import { ApiProperty } from '@nestjs/swagger';

export class GetOrdersReqDto {
  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false })
  token_id: string;

  @ApiProperty({ required: false })
  collection_slug: string;

  @ApiProperty({ required: false })
  offset: number;

  @ApiProperty({ required: false, default: 10 })
  limit: number;
}
