import { ApiProperty } from '@nestjs/swagger';

export class GetAvailableCount {
  @ApiProperty()
  user: string;
}
