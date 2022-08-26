import { ApiProperty } from '@nestjs/swagger';

import { EventType } from '../../../common/constants/event-type.enum';
import { User } from '../../user/entities/user.entity';

export class CreateEventReqDto {
  @ApiProperty()
  from_user: User;

  @ApiProperty()
  to_user: User;

  @ApiProperty()
  type: EventType;

  @ApiProperty()
  asset_id: string;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  quantity?: number;

  @ApiProperty()
  timestamp: number;
}
