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

  async findAll() {
    const posts = await this.prisma.post.findMany({
      where: { sourceId: null },
      include: {
        author: true,
        likes: true,
        source: { include: { author: true, likes: true } },
        childPosts: {
          include: {
            likes: true,
            author: true,
            childPosts: true,
            source: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });
    return posts;
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        likes: true,
        author: true,
        source: { include: { author: true, likes: true } },
        childPosts: {
          include: { author: true, likes: true, childPosts: true },
        },
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
