import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFollowDto {
  @ApiProperty()
  @IsNumber()
  followTo: number;
  @ApiProperty()
  @IsNumber()
  followBy: number;
}
