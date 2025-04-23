import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}

  async create({ id }: User, createAppointmentDto: CreateAppointmentDto) {
    const { doctorId, patientId, date, duration } = createAppointmentDto;
    const appointmentDate = new Date(date);
    const appointmentEndTime = new Date(appointmentDate);
    appointmentEndTime.setMinutes(
      appointmentEndTime.getMinutes() + (duration || 30),
    );

    if (appointmentDate < new Date()) {
      throw new BadRequestException(
        'Não é possível agendar para datas passadas',
      );
    }

    return this.prismaService.$transaction(async (prisma) => {
      const doctor = await this.doctorsService.findOne(doctorId);
      const patient = await this.patientsService.findOne(patientId);

      const attendant = await prisma.attendant.findUnique({
        where: { userId: id },
      });

      const conflictingPatientAppointments = await prisma.appointment.findMany({
        where: {
          patientId: patient.userId,
          date: { lt: appointmentEndTime },
          OR: [
            {
              date: { gte: appointmentDate },
            },
            {
              date: {
                lt: appointmentDate,
              },
              duration: {
                gt: this.minutesBetween(appointmentDate, new Date(date)),
              },
            },
          ],
        },
      });

      const conflictingDoctorAppointments = await prisma.appointment.findMany({
        where: {
          doctorId: doctor.userId,
          date: { lt: appointmentEndTime },
          OR: [
            {
              date: { gte: appointmentDate },
            },
            {
              date: {
                lt: appointmentDate,
              },
              duration: {
                gt: this.minutesBetween(appointmentDate, new Date(date)),
              },
            },
          ],
        },
      });

      if (conflictingPatientAppointments.length > 0) {
        throw new ConflictException(
          'Paciente já possui consulta marcada para este horário',
        );
      }

      if (conflictingDoctorAppointments.length > 0) {
        throw new ConflictException(
          'Doutor já possui consulta marcada para este horário',
        );
      }

      return prisma.appointment.create({
        data: {
          date: appointmentDate,
          status: 'PENDING',
          reason: createAppointmentDto.reason,
          notes: createAppointmentDto.notes,
          duration: duration || 30,
          patientId: patient.userId,
          doctorId: doctor.userId,
          attendantId: attendant?.id,
        },
      });
    });
  }

  private minutesBetween(date1: Date, date2: Date): number {
    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60));
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
