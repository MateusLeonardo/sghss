import { Injectable } from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class MedicalRecordsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}
  async create(user: User, createMedicalRecordDto: CreateMedicalRecordDto) {
    const doctor = await this.doctorsService.findByUserId(user.id);
    const patient = await this.patientsService.findOne(
      createMedicalRecordDto.patientId,
    );

    return this.prismaService.medicalRecord.create({
      data: {
        ...createMedicalRecordDto,
        doctorId: doctor.id,
        patientId: patient.id,
      },
    });
  }

  findAll() {
    return `This action returns all medicalRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalRecord`;
  }

  update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return `This action updates a #${id} medicalRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalRecord`;
  }
}
