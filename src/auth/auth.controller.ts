import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/auth/guards/refreshToken.guard';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

const getMaxAge = (value: number) => value * 24 * 60 * 60 * 1000;
const updateRefreshToken = ({
  response,
  refreshToken,
  isLogout,
}: {
  response: Response;
  refreshToken: string;
  isLogout?: boolean;
}) => {
  response.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: isLogout ? 0 : getMaxAge(7),
  });
};
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(createUserDto);
    updateRefreshToken({ response, refreshToken });
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: getMaxAge(1),
    });
    return response.send({ status: 'Registered' });
  }

  @Post('signin')
  async signin(@Body() data: AuthDto, @Res() response: Response) {
    const { accessToken, refreshToken } = await this.authService.signIn(data);
    updateRefreshToken({ response, refreshToken });
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: getMaxAge(1),
    });

    return response.send({ status: 'Logged' });
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() response: Response) {
    updateRefreshToken({ response, refreshToken: '', isLogout: true });
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    await this.authService.logout(req.user['sub'].id);
    return response.send({ logout: true });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessTokenGuard)
  @Get('session')
  async getSession(@Req() req: Request) {
    const userId = req.user['sub'].id;
    return new UserEntity(await this.userService.findById(userId));
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.cookies.refreshToken;
    const accessToken = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    return { accessToken };
  }
}
