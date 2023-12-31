import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ required: false, nullable: true })
  refreshToken: string | null;
  @ApiProperty()
  createdAt: Date;
}
