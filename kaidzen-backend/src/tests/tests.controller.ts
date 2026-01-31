import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Diagnostics / Tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active diagnostic tests' })
  findAll() {
    return this.testsService.findAll();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get test details with questions and options' })
  findOne(@Param('slug') slug: string) {
    return this.testsService.findOne(slug);
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
