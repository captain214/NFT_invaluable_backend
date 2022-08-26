import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionReqDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  banner_url: string;

  @ApiProperty()
  category_id: string;
}
