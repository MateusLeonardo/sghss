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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @Roles('ADMIN')
  @Permissions('create', 'Doctor')
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Roles('ADMIN')
  @Permissions('read', 'Doctor')
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCTOR')
  @Permissions('read', 'Doctor')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DOCTOR')
  @Permissions('update', 'Doctor')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @Permissions('delete', 'Doctor')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}
