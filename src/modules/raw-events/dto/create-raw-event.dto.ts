import { ApiProperty } from '@nestjs/swagger';

export class CreateRawEventDto {
  @ApiProperty()
  block: number;

  @ApiProperty()
  log_index: number;

  @ApiProperty()
  transaction_hash: string | undefined;

  @ApiProperty()
  chain: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  handled?: boolean;
}
