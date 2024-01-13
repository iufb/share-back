import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [AuthService, UsersService],
    }).compile();
    const USER_NOT_FOUND = 'User/users  not found.';
    const USER_EXISTS = 'User with provided email already exists.';
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('signin be working', async () => {
    const res = await service.signIn({
      email: 'nadil@gmail.com',
      password: '19931991iu',
    });
    expect(res.accessToken).toBeDefined();
  });
});
