import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogStatus } from '../common/enums';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto) {
    return this.prisma.blogPost.create({
      data: dto,
      include: { image: true },
    });
  }

  async findAll(status?: BlogStatus) {
    return this.prisma.blogPost.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: { image: true },
    });
  }

  async findOne(idOrSlug: string) {
    const searchKey = idOrSlug.trim();
    // Standard UUID regex
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchKey);
    
    let post;

    if (isUuid) {
      post = await this.prisma.blogPost.findUnique({
        where: { id: searchKey },
        include: { image: true },
      });
    }

    if (!post) {
      post = await this.prisma.blogPost.findUnique({
        where: { slug: searchKey },
        include: { image: true },
      });
    }

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, dto: any) {
    const { id: _, createdAt: __, updatedAt: ___, ...updateData } = dto;
    return this.prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: { image: true },
    });
  }

  async remove(id: string) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
