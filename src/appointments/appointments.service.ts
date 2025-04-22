import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  async create({id}: User, createAppointmentDto: CreateAppointmentDto) {
    // todo: verificar se o paciente existe
    // todo: verificar se o doutor existe
    // todo: verificar se o paciente já tem consulta marcada para o mesmo dia e horário
    // todo: verificar se o doutor já tem consulta marcada para o mesmo dia e horário
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
