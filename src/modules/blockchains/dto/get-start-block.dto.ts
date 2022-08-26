import { ApiProperty } from '@nestjs/swagger';

export class GetStartBlockDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;
}
