import { ApiProperty } from '@nestjs/swagger';

export class GetItemsToMintReqDto {
  @ApiProperty()
  user: string;

  @ApiProperty()
  quantity: number;
}
