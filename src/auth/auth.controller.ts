import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-registers.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() authRegisterDto: AuthRegisterDto) {
    return this.authService.register(authRegisterDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@UserDecorator() user: User) {
    return this.authService.login(user);
  }
}
