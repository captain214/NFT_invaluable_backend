import { ApiProperty } from '@nestjs/swagger';

import { EventType } from '../../../common/constants/event-type.enum';

export class GetEventsReqDto {
  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false })
  token_id: string;

  @ApiProperty({ required: false, enum: EventType })
  type: EventType;

  @ApiProperty({ required: false })
  occurred_after: string;
}
