import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Diagnostics / Tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new diagnostic test' })
  create(@Body() dto: CreateTestDto) {
    return this.testsService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active diagnostic tests' })
  findAll() {
    return this.testsService.findAll();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Get all tests (active and inactive) for admin' })
  findAllAdmin() {
    return this.testsService.findAllAdmin();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get test details with questions and options' })
  findOne(@Param('slug') slug: string) {
    return this.testsService.findOne(slug);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin/:id')
  @ApiOperation({ summary: 'Get test details by ID for admin' })
  findOneById(@Param('id') id: string) {
    return this.testsService.findOneById(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a diagnostic test' })
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testsService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a diagnostic test' })
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Put(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle test active status' })
  toggleActive(@Param('id') id: string) {
    return this.testsService.toggleActive(id);
  }

  @ApiBearerAuth()
  @Post('submit')
  @ApiOperation({ summary: 'Submit test answers and get result' })
  submit(@GetUser('id') userId: string, @Body() dto: SubmitTestDto) {
    return this.testsService.submit(userId, dto);
  }

  @ApiBearerAuth()
  @Get('my/results')
  @ApiOperation({ summary: 'Get current user test results' })
  getMyResults(@GetUser('id') userId: string) {
    return this.testsService.getUserResults(userId);
  }
}
