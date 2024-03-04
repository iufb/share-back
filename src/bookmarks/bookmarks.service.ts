import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { postIncludesProps } from 'src/posts/posts.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}
  create({ postId }: CreateBookmarkDto, userId: number) {
    return this.prisma.bookmark.create({
      data: { userId, postId },
    });
  }

  findAll(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          ...postIncludesProps,
        },
      },
    });
  }

  findOne(userId: number, id: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        postId: id,
        userId,
      },
    });
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  remove(userId: number, sourceId: number) {
    return this.prisma.bookmark.delete({
      where: {
        bookmarkId: { postId: sourceId, userId },
      },
    });
  }
}
