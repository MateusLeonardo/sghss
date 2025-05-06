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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles('ADMIN', 'ATTENDANT')
  @Permissions('create', 'Patient')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @Roles('ADMIN', 'ATTENDANT')
  @Permissions('read', 'Patient')
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'ATTENDANT', 'DOCTOR', 'PATIENT')
  @Permissions('read', 'Patient')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ATTENDANT', 'DOCTOR')
  @Permissions('update', 'Patient')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @Permissions('delete', 'Patient')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
