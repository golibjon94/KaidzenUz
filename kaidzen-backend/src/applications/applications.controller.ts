import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus, Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a new application form' })
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all applications (Admin only)' })
  findAll() {
    return this.applicationsService.findAll();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update application status (Admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.applicationsService.updateStatus(id, status);
  }
}
