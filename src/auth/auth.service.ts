import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { USER_EXISTS, USER_NOT_FOUND } from 'src/users/users.constants';
import { AuthDto } from './dto/auth.dto';
import { ACCESS_DENIED, WRONG_PASSWORD } from './auth.constants';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException(USER_EXISTS);
    }
    const passwordHash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: passwordHash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authDto: AuthDto) {
    const { userId, email } = await this.validateUser(
      authDto.email,
      authDto.password,
    );
    const tokens = await this.getTokens(userId, email);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  // Update refreshToken to null
  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return { userId: user.id, email };
  }
  async hashData(data: string) {
    const salt = await genSalt(10);
    return hash(data, salt);
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException(ACCESS_DENIED);
    }
    const refreshTokenMatches = await compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException(ACCESS_DENIED);
    const tokens = await this.getTokens(userId, user.email);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens.accessToken;
  }
}
