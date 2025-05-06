import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  ExtractJwt,
} from 'passport-jwt';
import { AuthService } from '../auth.service';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly prisemaService: PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        '', 
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user =
      await this.prisemaService.user.findUnique({
        where: {
          id: payload.sub,
          email: payload.email,
        },
      });
    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is inactive',
      );
    }

    return user;
  }
}
