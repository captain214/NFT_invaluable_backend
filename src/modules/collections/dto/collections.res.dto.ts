import { ApiProperty } from '@nestjs/swagger';

import type { Collection } from '../entities/collection.entity';

export class CollectionsResDto {
  @ApiProperty()
  collections: Collection[];

  @ApiProperty()
  count: number;
}
