// src/auth/strategies/jwt.strategy.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY', { infer: true })!,
    });
  }

  async validate(payload: { email: string; sub: number; role: Role }) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userData } = user;
    return userData;
  }
}
