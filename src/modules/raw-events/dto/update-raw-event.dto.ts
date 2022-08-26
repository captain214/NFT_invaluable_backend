import { PartialType } from '@nestjs/swagger';
import { CreateRawEventDto } from './create-raw-event.dto';

export class UpdateRawEventDto extends PartialType(CreateRawEventDto) {}
