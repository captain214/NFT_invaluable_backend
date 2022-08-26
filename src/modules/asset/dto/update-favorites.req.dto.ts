import { ApiProperty } from '@nestjs/swagger';

export class UpdateFavoriteReqDto {
  @ApiProperty()
  assetId: string;

  @ApiProperty()
  userAddress: string;
}
