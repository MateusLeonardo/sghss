import { AppointmentStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  doctorId: number;

  @IsInt()
  patientId: number;

  @IsInt()
  @IsOptional()
  attendantId?: number;

  @IsDateString()
  date: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus = AppointmentStatus.PENDING;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsNumber()
  @IsOptional()
  duration: number;
}
