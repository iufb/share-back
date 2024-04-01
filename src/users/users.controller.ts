import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MultipartBodyTransformPipe } from 'src/pipes/multipart-transform.pipe';
import { SharpPipe } from 'src/pipes/sharp.pipe';
import { getExceptionMessage } from 'src/utils/exception-message';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateFollowDto } from 'src/users/dto/create-follow.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
const USER_NOT_FOUND = getExceptionMessage(404, 'User/users');
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }
  @UseGuards(AccessTokenGuard)
  @Post()
  async follow(@Body() createFollowDto: CreateFollowDto) {
    return this.usersService.createFollow(createFollowDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    if (users.length == 0) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return users.map((user) => new UserEntity(user));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return new UserEntity(user);
  }

  @UsePipes(new MultipartBodyTransformPipe('user'), new ValidationPipe())
  @UseInterceptors(
    ClassSerializerInterceptor,
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  @ApiOkResponse({ type: UserEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles(SharpPipe)
    { avatar, cover }: { avatar: string; cover: string },
  ) {
    return new UserEntity(
      await this.usersService.update(id, updateUserDto, avatar, cover),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
