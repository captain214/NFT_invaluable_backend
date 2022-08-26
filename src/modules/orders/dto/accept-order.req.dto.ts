import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/entities/user.entity';

export class AcceptOrderReqDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  taker: User;
}
