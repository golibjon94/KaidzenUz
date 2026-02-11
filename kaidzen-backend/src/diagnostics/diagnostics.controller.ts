import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';
import { DiagnosticsService } from './diagnostics.service';

@ApiTags('Diagnostics (Admin)')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('diagnostics')
export class DiagnosticsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  @Post()
  @ApiOperation({ summary: 'Create diagnostic (Admin only)' })
  create(@Body() dto: CreateDiagnosticDto) {
    return this.diagnosticsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get diagnostics (Admin only)' })
  findAll() {
    return this.diagnosticsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get diagnostic by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.diagnosticsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update diagnostic (Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateDiagnosticDto) {
    return this.diagnosticsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete diagnostic (Admin only)' })
  remove(@Param('id') id: string) {
    return this.diagnosticsService.remove(id);
  }
}
