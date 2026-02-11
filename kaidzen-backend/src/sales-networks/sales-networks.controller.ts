import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateSalesNetworkDto } from './dto/create-sales-network.dto';
import { UpdateSalesNetworkDto } from './dto/update-sales-network.dto';
import { SalesNetworksService } from './sales-networks.service';

@ApiTags('Sales Networks (Admin)')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('sales-networks')
export class SalesNetworksController {
  constructor(private readonly salesNetworksService: SalesNetworksService) {}

  @Post()
  @ApiOperation({ summary: 'Create sales network (Admin only)' })
  create(@Body() dto: CreateSalesNetworkDto) {
    return this.salesNetworksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get sales networks (Admin only)' })
  findAll() {
    return this.salesNetworksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sales network by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.salesNetworksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sales network (Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateSalesNetworkDto) {
    return this.salesNetworksService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sales network (Admin only)' })
  remove(@Param('id') id: string) {
    return this.salesNetworksService.remove(id);
  }
}
