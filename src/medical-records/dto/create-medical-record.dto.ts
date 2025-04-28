import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMedicalRecordDto {
    @IsNumber()
    patientId: number;

    @IsNumber()
    doctorId: number;

    @IsString()
    diagnosis: string;

    @IsString()
    @IsOptional()
    prescription?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
