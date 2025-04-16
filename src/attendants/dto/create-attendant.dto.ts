import { Role } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateAttendantDto extends CreateUserDto {
    @IsEnum(Role)
    role: Role = Role.ATTENDANT;

    @IsString()
    accessCode: string;
}
