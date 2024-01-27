import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, files: string[]) {
    return this.prisma.post.create({
      data: { ...createPostDto, images: files },
    });
  }

  async findAll(userId: number) {
    const posts = await this.prisma.post.findMany({
      include: { author: true, likes: true },
      orderBy: [{ createdAt: 'desc' }],
    });
    return posts.map((post) => {
      const isLiked = !!post.likes.find((like) => like.userId === userId);
      return {
        ...post,
        isLiked: isLiked,
        likesCount: post.likes.length,
      };
    });
  }

  async findOne(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { likes: true, author: true },
    });
    const isLiked = !!post.likes.find((like) => like.userId === userId);
    return {
      ...post,
      isLiked: isLiked,
      likesCount: post.likes.length,
    };
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
