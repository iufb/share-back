import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  NotFoundException,
  UploadedFiles,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { PostEntity } from './entities/post.entity';
import { getExceptionMessage } from 'src/utils/exception-message';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MultipartBodyTransformPipe } from 'src/pipes/multipart-transform.pipe';
import { SharpPipe } from 'src/pipes/sharp.pipe';
const POST_NOT_FOUND = getExceptionMessage(404, 'Post/posts');
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UsePipes(new MultipartBodyTransformPipe('post'), new ValidationPipe())
  @UseInterceptors(ClassSerializerInterceptor, FilesInterceptor('files'))
  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body()
    createPostDto: CreatePostDto,
    @UploadedFiles(SharpPipe) files: string[],
  ) {
    return new PostEntity(await this.postsService.create(createPostDto, files));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll() {
    const posts = await this.postsService.findAll();
    if (posts.length == 0) {
      return [];
    }
    return posts.map((post) => new PostEntity(post));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }
    return new PostEntity(post);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
