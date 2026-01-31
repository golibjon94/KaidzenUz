import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogStatus } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto) {
    return this.prisma.blogPost.create({
      data: dto,
    });
  }

  async findAll(status?: BlogStatus) {
    return this.prisma.blogPost.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, dto: any) {
    const { id: _, createdAt: __, updatedAt: ___, ...updateData } = dto;
    return this.prisma.blogPost.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
