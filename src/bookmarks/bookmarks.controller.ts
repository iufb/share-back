import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { Request } from 'express';
import { PostEntity } from 'src/posts/entities/post.entity';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto, @Req() req: Request) {
    const userId = req.user['sub'].id;
    return this.bookmarksService.create(createBookmarkDto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Req() req: Request) {
    const userId = req.user['sub'].id;
    const bookmarks = await this.bookmarksService.findAll(userId);
    return bookmarks.map(({ post }) => new PostEntity({ userId, post }));
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  IsPostBookmarked(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): boolean {
    const userId = req.user['sub'].id;
    const bookmark = this.bookmarksService.findOne(userId, id);
    return !!bookmark;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(+id, updateBookmarkDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user['sub'].id;
    return this.bookmarksService.remove(userId, id);
  }
}
