import { PartialType } from '@nestjs/swagger';

import { CreateCollectionReqDto } from './create-collection.req.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionReqDto) {}
