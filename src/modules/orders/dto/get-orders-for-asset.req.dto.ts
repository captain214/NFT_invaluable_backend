import { ApiProperty } from '@nestjs/swagger';

import { OrderStatus } from '../../../common/constants/order-status.enum';

export class GetOrdersForAssetReqDto {
  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  token_id?: number;

  @ApiProperty({ required: false })
  asset_id?: string;

  @ApiProperty({ required: false })
  status?: OrderStatus;

  @ApiProperty({ required: false })
  offer_id?: string;
}
