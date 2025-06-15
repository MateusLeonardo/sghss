import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ email, cpf, password, role, name }: CreateUserDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        cpf,
        password: hashedPassword,
        role,
        name,
      },
    });
    const { password: _, ...result } = newUser;

    return result;
  }

  findAll() {
    return this.prismaService.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!userToUpdate) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email || updateUserDto.cpf) {
      const existingUser = await this.prismaService.user.findFirst({
        where: {
          id: {
            not: id,
          },
          OR: [
            ...(updateUserDto.email &&
            updateUserDto.email !== userToUpdate.email
              ? [{ email: updateUserDto.email }]
              : []),
            ...(updateUserDto.cpf && updateUserDto.cpf !== userToUpdate.cpf
              ? [{ cpf: updateUserDto.cpf }]
              : []),
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === updateUserDto.email) {
          throw new ConflictException('Email já está em uso por outro usuário');
        }
        if (existingUser.cpf === updateUserDto.cpf) {
          throw new ConflictException('CPF já está em uso por outro usuário');
        }
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        await bcrypt.genSalt(),
      );
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const deletedUser = await this.prismaService.user.delete({
      where: {
        id,
      },
    });
    const { password, ...result } = deletedUser;
    return result;
  }
}
