import { Injectable, NotFoundException } from '@nestjs/common';
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
    await this.patientsService.findOne(createMedicalRecordDto.patientId);

    return this.prismaService.medicalRecord.create({
      data: {
        ...createMedicalRecordDto,
        doctorId: doctor.id,
      },
    });
  }

  findAll() {
    return this.prismaService.medicalRecord.findMany();
  }

  async findOne(id: number) {
    const medicalRecord = await this.prismaService.medicalRecord.findUnique({
      where: { id },
    });

    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found');
    }

    return medicalRecord;
  }

  update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return `This action updates a #${id} medicalRecord`;
  }

  async remove(id: number) {
    const medicalRecord = await this.prismaService.medicalRecord.findUnique({
      where: { id },
    });
    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found');
    }
    return this.prismaService.medicalRecord.delete({
      where: { id },
    });
  }
}
