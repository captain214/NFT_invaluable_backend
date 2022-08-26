import { ApiProperty } from '@nestjs/swagger';

export class GetItemsToMintResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tokenUri: string;
}
