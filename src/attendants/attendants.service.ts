import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendantDto } from './dto/create-attendant.dto';
import { UpdateAttendantDto } from './dto/update-attendant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Role } from '@prisma/client';

@Injectable()
export class AttendantsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}
  async create({ accessCode, ...user }: CreateAttendantDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userExists) throw new ConflictException('User already exists');

    const { id } = await this.usersService.create({
      ...user,
      role: Role.ATTENDANT,
    });

    return this.prismaService.attendant.create({
      data: {
        accessCode,
        userId: id,
      },
    });
  }

  findAll() {
    return this.prismaService.attendant.findMany();
  }

  async findOne(id: number) {
    const attendant = await this.prismaService.attendant.findUnique({
      where: {
        id,
      },
    });
    if (!attendant) throw new NotFoundException('Attendant not found');
    return attendant;
  }

  async update(id: number, { accessCode, ...user }: UpdateAttendantDto) {
    const patientExists = await this.prismaService.attendant.findUnique({
      where: { id },
    });
    if (!patientExists) throw new NotFoundException('Attendant not found');

    // await this.usersService.update(patientExists.userId, user)
    return this.prismaService.attendant.update({
      where: { id },
      data: {
        accessCode,
        user: {
          update: {
            ...user,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const attendantExists = await this.prismaService.attendant.findUnique({
      where: { id },
    });
    if (!attendantExists) throw new NotFoundException('Attendant not found');

    return this.prismaService.attendant.delete({
      where: { id },
    });
  }
}
