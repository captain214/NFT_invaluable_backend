import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetCollectionReqDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false })
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  slug: string;
}
