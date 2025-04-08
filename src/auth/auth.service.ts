import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth-registers.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }

  async register({ email, password }: AuthRegisterDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return new ConflictException('User already exists');
    }

    const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt());
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: passwordHashed,
      },
    });
    return this.login(user);
  }

  login({ id, email }: User) {
    const payload = { email: email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
