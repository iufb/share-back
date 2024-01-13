import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
};
function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }
  return token;
}
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
