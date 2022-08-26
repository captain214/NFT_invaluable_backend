import { PartialType } from '@nestjs/swagger';
import { CreateUniqueSetDto } from './create-unique-set.dto';

export class UpdateUniqueSetDto extends PartialType(CreateUniqueSetDto) {}
