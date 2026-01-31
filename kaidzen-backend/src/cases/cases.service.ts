import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCaseDto) {
    return this.prisma.businessCase.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async findAll() {
    return this.prisma.businessCase.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.businessCase.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.businessCase.delete({
      where: { id },
    });
  }
}
