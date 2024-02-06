import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
  @ApiProperty()
  images: string[];
  @ApiProperty()
  sourceId?: number;
  @ApiProperty()
  source?: PostEntity;
  @ApiProperty()
  childPosts?: PostEntity[];
  @ApiProperty()
  isLiked?: boolean;
  @ApiProperty()
  likesCount?: number;
  @ApiProperty()
  repliesCount?: number;

  @Exclude()
  likes?: { userId: number; postId: number }[];

  constructor({
    userId,
    post,
  }: {
    userId?: number;
    post: Partial<PostEntity>;
  }) {
    const { author, likes, source, childPosts, ...data } = post;
    Object.assign(this, data);
    if (author) {
      this.author = new UserEntity(author);
    }
    if (userId) {
      if (!likes) {
        this.isLiked = false;
      } else {
        this.isLiked = !!likes.find((like) => like.userId === userId);
        this.likesCount = likes.length;
      }
    }
    if (source) {
      this.source = new PostEntity({ post: source });
    }
    if (childPosts) {
      this.childPosts = childPosts.map(
        (post) => new PostEntity({ userId, post }),
      );
      this.repliesCount = childPosts.length;
    }
  }
}
