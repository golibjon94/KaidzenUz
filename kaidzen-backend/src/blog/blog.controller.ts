import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogStatus, Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new blog post (Admin only)' })
  create(@Body() dto: CreatePostDto) {
    return this.blogService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  findAll(@Query('status') status?: BlogStatus) {
    return this.blogService.findAll(status);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by id or slug' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update blog post (Admin only)' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.blogService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete blog post (Admin only)' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
