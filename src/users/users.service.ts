import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_EXISTS } from './users.constants';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const isUserExist = !!(await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    }));
    if (isUserExist) {
      throw new ConflictException(USER_EXISTS);
    }
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  update(
    id: number,
    updateUserDto: UpdateUserDto,
    avatar?: string,
    cover?: string,
  ) {
    const data: UpdateUserDto & { avatar?: string; cover?: string } = {
      ...updateUserDto,
    };
    if (avatar) {
      data.avatar = avatar;
    }
    if (cover) {
      data.cover = cover;
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
