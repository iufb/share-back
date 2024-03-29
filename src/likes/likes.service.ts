import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}
  create({ sourceId }: CreateLikeDto, userId: number) {
    return this.prisma.postLike.create({
      data: { userId, postId: sourceId },
    });
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(userId: number, sourceId: number) {
    return this.prisma.postLike.delete({
      where: {
        postLikeId: { postId: sourceId, userId },
      },
    });
  }
}
