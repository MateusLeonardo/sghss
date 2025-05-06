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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendants')
export class AttendantsController {
  constructor(private readonly attendantsService: AttendantsService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createAttendantDto: CreateAttendantDto) {
    return this.attendantsService.create(createAttendantDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.attendantsService.findAll();
  }

  @Roles('ADMIN', 'ATTENDANT')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendantsService.findOne(+id);
  }

  @Roles('ADMIN', 'ATTENDANT')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendantDto: UpdateAttendantDto,
  ) {
    return this.attendantsService.update(+id, updateAttendantDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendantsService.remove(+id);
  }
}
