import { Module } from '@nestjs/common';
import { AttendantsService } from './attendants.service';
import { AttendantsController } from './attendants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CaslAbilityModule } from 'src/casl/casl.module';

@Module({
  imports: [PrismaModule, UsersModule, CaslAbilityModule],
  controllers: [AttendantsController],
  providers: [AttendantsService],
})
export class AttendantsModule {}
