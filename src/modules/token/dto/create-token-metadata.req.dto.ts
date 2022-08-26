import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenMetadataReqDto {
  @ApiProperty()
  description: string;
  @ApiProperty()
  image_url: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  collection_id: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  attributes: Array<Record<string, unknown>>;
}
