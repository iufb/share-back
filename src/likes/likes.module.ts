import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from 'src/likes/likes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService],
})
export class LikesModule {}
