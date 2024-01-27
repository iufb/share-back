import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  cover: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  bio: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
