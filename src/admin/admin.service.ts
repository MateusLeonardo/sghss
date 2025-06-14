import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create({ accessCode, ...userData }: CreateAdminDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (userExists)
      throw new ConflictException('Já existe um usuário com este e-mail');

    const createdUser = await this.usersService.create({
      ...userData,
      role: Role.ADMIN,
    });
    const adminExists = await this.prismaService.admin.findUnique({
      where: {
        accessCode,
      },
    });
    if (adminExists) throw new ConflictException('Código de acesso já existe');

    return this.prismaService.admin.create({
      data: {
        userId: createdUser.id,
        accessCode,
      },
    });
  }

  findAll() {
    return this.prismaService.admin.findMany({
      include: {
        user: {
          omit: {
            password: true,
            id: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const admin = await this.prismaService.admin.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
            id: true,
            role: true,
          },
        },
      },
    });

    if (!admin) throw new NotFoundException('Admin não encontrado');

    return admin;
  }

  async update(id: number, { accessCode, ...userData }: UpdateAdminDto) {
    const admin = await this.prismaService.admin.findFirst({
      where: {
        id,
      },
    });

    if (!admin) throw new NotFoundException('Admin não encontrado');

    await this.usersService.update(admin.userId, userData);

    if (accessCode) {
      const existsAdminAccessCode = await this.prismaService.admin.findUnique({
        where: {
          accessCode,
        },
      });

      if (existsAdminAccessCode)
        throw new ConflictException('Código de acesso já existe');
    }

    return this.prismaService.admin.update({
      where: {
        id,
      },
      data: {
        accessCode,
      },
      include: {
        user: {
          omit: {
            password: true,
            id: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const admin = await this.prismaService.admin.findFirst({
      where: {
        id,
      },
    });

    if (!admin) throw new NotFoundException('Admin não encontrado');

    return this.prismaService.admin.delete({
      where: {
        id,
      },
    });
  }
}
