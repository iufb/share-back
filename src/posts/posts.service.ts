import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
const includesProps = {
  include: {
    author: true,
    likes: true,
    source: { include: { author: true, likes: true } },
    childPosts: {
      where: { isRepost: false },
      include: {
        likes: true,
        author: true,
        childPosts: true,
        source: true,
      },
    },
  },
};
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
      where: { sourceId: null, isRepost: false },
      ...includesProps,
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
          where: { isRepost: false },
          include: { author: true, likes: true, childPosts: true },
        },
      },
    });
  }
  async findReposts(id: number) {
    const reposts = await this.prisma.post.findMany({
      where: { sourceId: id, isRepost: true },
    });
    return reposts;
  }
  async findLikedPosts(userId: number) {
    const likedPosts = await this.prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      ...includesProps,
      orderBy: [{ createdAt: 'desc' }],
    });

    return likedPosts;
  }
  async findUserReplies(userId: number) {
    const replies = await this.prisma.post.findMany({
      where: {
        authorId: userId,
        isReply: true,
      },
      ...includesProps,
      orderBy: [{ createdAt: 'desc' }],
    });

    return replies;
  }
  //FIX
  async findUserPosts(userId: number) {
    const postsAndReposts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      ...includesProps,
      orderBy: [{ createdAt: 'desc' }],
    });
    return postsAndReposts;
  }

  async getRepliesCount(id: number) {
    const reply = await this.prisma.post.findUnique({
      where: { id },
      include: { childPosts: true },
    });
    return {
      sourceId: id,
      count: reply.childPosts.filter((post) => post.isReply).length,
    };
  }
  async getRepostsCount(id: number, userId: number) {
    const reposts = await this.findReposts(id);
    //convert -1 to false
    const repostedPost = reposts.find((repost) => repost.authorId === userId);

    return {
      count: reposts.length,
      isReposted: !!repostedPost,
      repostId: repostedPost?.id ?? null,
    };
  }
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
