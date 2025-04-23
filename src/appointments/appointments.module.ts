import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [PrismaModule, DoctorsModule, PatientsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
