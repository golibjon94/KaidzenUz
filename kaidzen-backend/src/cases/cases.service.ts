import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateCaseDto) {
    return this.prisma.businessCase.create({
      data: {
        salesNetworkId: dto.salesNetworkId,
        problem: dto.problem,
        solution: dto.solution,
        result: dto.result,
        dateFrom: dto.dateFrom ? new Date(dto.dateFrom) : null,
        dateTo: dto.dateTo ? new Date(dto.dateTo) : null,
      },
    });
  }
  async findAll() {
    return this.prisma.businessCase.findMany({
      include: { salesNetwork: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async findOne(id: string) {
    return this.prisma.businessCase.findUnique({
      where: { id },
      include: { salesNetwork: true },
    });
  }
  async remove(id: string) {
    return this.prisma.businessCase.delete({
      where: { id },
    });
  }
}
