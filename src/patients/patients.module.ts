import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
