import { PartialType } from '@nestjs/swagger';

import { CreateEventReqDto } from './create-event.req.dto';

export class UpdateEventDto extends PartialType(CreateEventReqDto) {}
