import { OmitType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateDoctorDto extends CreateUserDto {
  @IsEnum(Role)
  role: Role = Role.DOCTOR;

  @IsString()
  specialty: string;

  @IsString()
  crm: string;
}
