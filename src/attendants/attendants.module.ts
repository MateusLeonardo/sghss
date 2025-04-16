import { Module } from '@nestjs/common';
import { AttendantsService } from './attendants.service';
import { AttendantsController } from './attendants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AttendantsController],
  providers: [AttendantsService],
})
export class AttendantsModule {}
