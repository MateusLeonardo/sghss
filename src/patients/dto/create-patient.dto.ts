import { OmitType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BloodType } from 'src/enums/blood-type.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreatePatientDto extends OmitType(CreateUserDto, ['role'] as const) {
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
