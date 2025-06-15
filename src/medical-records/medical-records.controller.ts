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
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles('DOCTOR')
  @Permissions('create', 'MedicalRecord')
  create(
    @UserDecorator() user: User,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ) {
    return this.medicalRecordsService.create(user, createMedicalRecordDto);
  }

  @Get()
  @Roles('ADMIN')
  @Permissions('read', 'MedicalRecord')
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCTOR', 'PATIENT')
  @Permissions('read', 'MedicalRecord')
  findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('DOCTOR')
  @Permissions('update', 'MedicalRecord')
  update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordsService.update(+id, updateMedicalRecordDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @Permissions('delete', 'MedicalRecord')
  remove(@Param('id') id: string) {
    return this.medicalRecordsService.remove(+id);
  }
}
