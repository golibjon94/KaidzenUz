import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesNetworkDto } from './dto/create-sales-network.dto';
import { UpdateSalesNetworkDto } from './dto/update-sales-network.dto';

@Injectable()
export class SalesNetworksService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSalesNetworkDto) {
    return this.prisma.salesNetwork.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.salesNetwork.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const salesNetwork = await this.prisma.salesNetwork.findUnique({ where: { id } });
    if (!salesNetwork) throw new NotFoundException('Sales network not found');
    return salesNetwork;
  }

  async update(id: string, dto: UpdateSalesNetworkDto) {
    await this.findOne(id);
    return this.prisma.salesNetwork.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.salesNetwork.delete({ where: { id } });
  }
}
