import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.refreshToken;
  }
  return token;
}
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: any) {
    const refreshToken = req.cookies.refreshToken;
    return { ...payload, refreshToken };
  }
}
