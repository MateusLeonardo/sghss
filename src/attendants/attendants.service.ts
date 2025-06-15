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
        cpf: user.cpf,
      },
    });

    if (userExists) throw new ConflictException('Usuário já existe');

    const attentandExists = await this.prismaService.attendant.findUnique({
      where: {
        accessCode,
      },
    });

    if (attentandExists) throw new ConflictException('Atendente já existe');

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
    return this.prismaService.attendant.findMany({
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
    const attendant = await this.prismaService.attendant.findUnique({
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
    if (!attendant) throw new NotFoundException('Atendente não encontrado');
    return attendant;
  }

  async update(id: number, { accessCode, ...user }: UpdateAttendantDto) {
    const attendantExists = await this.prismaService.attendant.findUnique({
      where: { id },
    });
    if (!attendantExists)
      throw new NotFoundException('Atendente não encontrado');

    if (accessCode) {
      const attendantAccessCodeExists =
        await this.prismaService.attendant.findUnique({
          where: { accessCode },
        });
      if (attendantAccessCodeExists)
        throw new ConflictException('Código de acesso já existe');
    }

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
    const attendantExists = await this.prismaService.attendant.findUnique({
      where: { id },
    });
    if (!attendantExists) throw new NotFoundException('Attendant not found');

    await this.prismaService.attendant.delete({
      where: { id },
    });

    return this.usersService.remove(attendantExists.userId);
  }
}
