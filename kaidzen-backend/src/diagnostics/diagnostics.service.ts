import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';

@Injectable()
export class DiagnosticsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateDiagnosticDto) {
    return this.prisma.diagnostic.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.diagnostic.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const diagnostic = await this.prisma.diagnostic.findUnique({ where: { id } });
    if (!diagnostic) throw new NotFoundException('Diagnostic not found');
    return diagnostic;
  }

  async update(id: string, dto: UpdateDiagnosticDto) {
    await this.findOne(id);
    return this.prisma.diagnostic.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.diagnostic.delete({ where: { id } });
  }
}
