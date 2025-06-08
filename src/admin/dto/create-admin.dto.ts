import { Role } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateAdminDto extends CreateUserDto {
  @IsString()
  accessCode: string;

  @IsEnum(Role)
  role: Role = Role.ADMIN;
}
