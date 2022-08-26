import { ApiProperty } from '@nestjs/swagger';

import { OrderType } from '../../../common/constants/order-type.enum';
import { User } from '../../user/entities/user.entity';

export class CreateOrderReqDto {
  @ApiProperty()
  token_id: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  expiration_time?: Date;

  @ApiProperty()
  creator: User;

  @ApiProperty({ required: false })
  taker?: User;

  @ApiProperty()
  type: OrderType;

  @ApiProperty({ required: false })
  quantity?: number;

  @ApiProperty({ required: false })
  offer_id?: string;
}
