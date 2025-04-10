import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { IsCPF } from 'src/decorators/is-cpf.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 5,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @IsCPF()
  cpf: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  name: string;
}
