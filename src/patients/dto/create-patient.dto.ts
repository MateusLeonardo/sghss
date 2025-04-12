import { OmitType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BloodType } from 'src/enums/blood-type.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreatePatientDto extends CreateUserDto{
  @IsEnum(Role)
  role: Role = Role.PATIENT;

  @IsOptional()
  @IsEnum(BloodType)
  bloodType: BloodType;

  @IsString()
  @IsOptional()
  allergies: string;

  @IsString()
  @IsOptional()
  medications: string;
}
