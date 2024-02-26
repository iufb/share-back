import { ApiProperty } from '@nestjs/swagger';
import { PostLike } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class LikeEntity implements PostLike {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  createdAt: Date;

  @Exclude()
  postId: number;

  constructor(partial: Partial<LikeEntity>) {
    Object.assign(this, partial);
  }
}
