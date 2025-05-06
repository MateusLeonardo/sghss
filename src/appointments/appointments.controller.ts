import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('ADMIN', 'ATTENDANT')
  @Permissions('create', 'Appointment')
  create(
    @UserDecorator() user: User,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(user, createAppointmentDto);
  }

  @Get()
  @Roles('ADMIN', 'ATTENDANT')
  @Permissions('read', 'Appointment')
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'ATTENDANT', 'DOCTOR', 'PATIENT')
  @Permissions('read', 'Appointment')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ATTENDANT', 'DOCTOR')
  @Permissions('update', 'Appointment')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @Permissions('delete', 'Appointment')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
