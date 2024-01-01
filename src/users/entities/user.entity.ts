import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;

  @Exclude()
  password: string;
  @ApiProperty({ required: false, nullable: true })
  refreshToken: string | null;
  @ApiProperty()
  createdAt: Date;
}
