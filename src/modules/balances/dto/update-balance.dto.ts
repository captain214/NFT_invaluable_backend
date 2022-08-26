import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateBalanceDto } from './create-balance.dto';

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {
  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  quantity: number;
}
