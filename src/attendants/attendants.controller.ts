import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AttendantsService } from './attendants.service';
import { CreateAttendantDto } from './dto/create-attendant.dto';
import { UpdateAttendantDto } from './dto/update-attendant.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';

@Controller('attendants')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AttendantsController {
  constructor(private readonly attendantsService: AttendantsService) {}

  @Post()
  @Roles('ADMIN')
  @Permissions('create', 'Attendant')
  create(@Body() createAttendantDto: CreateAttendantDto) {
    return this.attendantsService.create(createAttendantDto);
  }

  @Get()
  @Roles('ADMIN')
  @Permissions('read', 'Attendant')
  findAll() {
    return this.attendantsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'ATTENDANT')
  @Permissions('read', 'Attendant')
  findOne(@Param('id') id: string) {
    return this.attendantsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ATTENDANT')
  @Permissions('update', 'Attendant')
  update(
    @Param('id') id: string,
    @Body() updateAttendantDto: UpdateAttendantDto,
  ) {
    return this.attendantsService.update(+id, updateAttendantDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @Permissions('delete', 'Attendant')
  remove(@Param('id') id: string) {
    return this.attendantsService.remove(+id);
  }
}
