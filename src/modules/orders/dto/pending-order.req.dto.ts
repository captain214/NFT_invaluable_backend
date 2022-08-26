import { ApiProperty } from '@nestjs/swagger';

export class PendingOrderReqDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quantity: number;
}
