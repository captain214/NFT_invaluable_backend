import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateUniqueSetDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Missing set name' })
  action_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Missing token uri list' })
  @ArrayMinSize(2, { message: 'Token uri list must have at least 2 uri' })
  token_uri_list: string[];

  @IsDateString({ strict: false }, { message: 'Show time is not a valid date' })
  @IsNotEmpty({ message: 'Missing show time' })
  show_time: Date;
}
