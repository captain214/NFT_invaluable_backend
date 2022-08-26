import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockchainDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: false })
  start_block: number;
}
