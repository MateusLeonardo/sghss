import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CaslAbilityModule } from 'src/casl/casl.module';

@Module({
  imports: [PrismaModule, UsersModule, CaslAbilityModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
