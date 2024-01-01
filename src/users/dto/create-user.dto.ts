import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  email: string;

  @IsString()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  refreshToken: string;
}
