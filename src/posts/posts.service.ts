import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export const postIncludesProps = {
  include: {
    author: true,
    source: {
      include: {
        author: true,
        likes: true,
        bookmarks: true,
        _count: {
          select: {
            bookmarks: true,
            likes: true,
          },
        },
      },
    },
    childPosts: {
      where: { isRepost: false },
      include: {
        likes: true,
        author: true,
        childPosts: true,
        source: true,
        bookmarks: true,
        _count: {
          select: {
            bookmarks: true,
            likes: true,
          },
        },
      },
    },
    likes: true,
    bookmarks: true,
    _count: {
      select: {
        bookmarks: true,
        likes: true,
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
      ...postIncludesProps,
      orderBy: [{ createdAt: 'desc' }],
    });

    return posts;
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },

      ...postIncludesProps,
      // include: {
      // likes: true,
      // author: true,
      // source: { include: { author: true, likes: true } },
      // childPosts: {
      //   where: { isRepost: false },
      //   include: { author: true, likes: true, childPosts: true },
      // },
      //},
    });
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
      ...postIncludesProps,
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
      ...postIncludesProps,
      orderBy: [{ createdAt: 'desc' }],
    });

    return replies;
  }
  //FIX
  async findUserPosts(userId: number) {
    const postsAndReposts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
        isReply: false,
      },
      ...postIncludesProps,
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
  async findReposts(id: number) {
    const reposts = await this.prisma.post.findMany({
      where: { sourceId: id, isRepost: true },
    });
    return reposts;
  }

  async getRepostsCount(id: number, userId: number) {
    const reposts = await this.findReposts(id);
    //convert -1 to false
    const repostedPost = reposts.find((repost) => repost.authorId === userId);

    return {
      count: reposts.length,
      isReposted: !!repostedPost,
      sourceId: id,
      repostId: repostedPost?.id ?? null,
    };
  }
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number, userId: number) {
    return this.prisma.post.delete({
      where: { id, isRepost: true, authorId: userId },
    });
  }
}
