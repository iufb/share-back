import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class PostEntity {
  @ApiProperty()
  id: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  authorId: number;
  @ApiProperty({ required: false, type: UserEntity })
  author?: UserEntity;

  constructor({ author, ...data }: Partial<PostEntity>) {
    Object.assign(this, data);
    if (author) {
      this.author = new UserEntity(author);
    }
  }
}
