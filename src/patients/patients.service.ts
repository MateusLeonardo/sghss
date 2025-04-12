import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const { bloodType, allergies, medications, ...userData } = createPatientDto;

    const user = await this.usersService.create({
      ...userData,
      role: Role.PATIENT,
    });

    const patient = await this.prismaService.patient.create({
      data: {
        userId: user.id,
        bloodType,
        allergies,
        medications,
      },
    });
    return patient;
  }

  findAll() {
    return this.prismaService.patient.findMany();
  }

  async findOne(id: number) {
    const patient = await this.prismaService.patient.findUnique({
      where: {
        id,
      },
    });
    if (!patient) {
      throw new BadRequestException('Patient not found');
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patientExists = await this.prismaService.patient.findUnique({
      where: {
        id,
      },
    });
    if (!patientExists) {
      throw new BadRequestException('Patient not found');
    }
    const { bloodType, allergies, medications, ...userData } = updatePatientDto;

    await this.usersService.update(id, {
      ...userData,
    });

    return this.prismaService.patient.update({
      where: {
        id,
      },
      data: {
        bloodType,
        allergies,
        medications,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    const patientExists = await this.prismaService.patient.findUnique({
      where: {
        id,
      },
    })

    if (!patientExists) throw new BadRequestException('Patient not found');

    return this.prismaService.patient.delete({
      where: {
        id
      }
    })
  }
}
