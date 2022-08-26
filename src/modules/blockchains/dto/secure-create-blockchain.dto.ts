import { ApiProperty } from '@nestjs/swagger';

import { CreateBlockchainDto } from './create-blockchain.dto';

export class SecureCreateBlockchainDto {
  @ApiProperty()
  payload: CreateBlockchainDto;

  @ApiProperty()
  address: string;

  @ApiProperty()
  signature: string;
}
