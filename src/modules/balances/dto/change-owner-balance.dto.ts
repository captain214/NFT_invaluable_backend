import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateBalanceDto } from './create-balance.dto';

export class ChangeOwnerDto extends PartialType(CreateBalanceDto) {
  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  address: string;
}
