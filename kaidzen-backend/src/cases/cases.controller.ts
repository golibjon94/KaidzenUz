import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Business Cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new business case (Admin only)' })
  create(@Body() dto: CreateCaseDto) {
    return this.casesService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all business cases' })
  findAll() {
    return this.casesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get business case by ID' })
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete business case (Admin only)' })
  remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
