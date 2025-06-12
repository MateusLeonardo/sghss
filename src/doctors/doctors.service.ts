import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Role } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}
  async create({ crm, specialty, ...user }: CreateDoctorDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (userExists) throw new ConflictException('User already exists');

    const createdUser = await this.usersService.create({
      ...user,
      role: Role.DOCTOR,
    });

    return this.prismaService.doctor.create({
      data: {
        crm,
        specialty,
        userId: createdUser.id,
      },
      include: {
        user: {
          omit: {
            id: true,
            password: true,
            role: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    const doctor = await this.prismaService.doctor.findUnique({
      where: {
        userId,
      },
    });

    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  findAll() {
    return this.prismaService.doctor.findMany({
      include: {
        user: {
          omit: {
            id: true,
            password: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const doctor = await this.prismaService.doctor.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            id: true,
            password: true,
            role: true,
          },
        },
      },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async update(id: number, { crm, specialty, ...userData }: UpdateDoctorDto) {
    const doctorExists = await this.prismaService.doctor.findUnique({
      where: { id },
    });

    if (!doctorExists) throw new NotFoundException('Doctor not found');

    await this.usersService.update(doctorExists.userId, {
      ...userData,
    });

    return this.prismaService.doctor.update({
      where: {
        id,
      },
      data: {
        crm,
        specialty,
      },
      include: {
        user: {
          omit: {
            id: true,
            password: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const doctorExists = await this.prismaService.doctor.findUnique({
      where: { id },
    });

    if (!doctorExists) throw new NotFoundException('Doctor not found');

    await this.prismaService.doctor.delete({
      where: { id },
    });

    return this.usersService.remove(doctorExists.userId);
  }
}
