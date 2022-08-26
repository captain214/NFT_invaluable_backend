import { ApiProperty } from '@nestjs/swagger';

export class UpdateFavoriteResDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  favorites: string[];
}
