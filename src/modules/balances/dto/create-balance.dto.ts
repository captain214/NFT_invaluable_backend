import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/entities/user.entity';

export class CreateBalanceDto {
  @ApiProperty()
  asset_id: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  quantity: number;
}
