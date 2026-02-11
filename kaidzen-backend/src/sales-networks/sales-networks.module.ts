import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SalesNetworksController } from './sales-networks.controller';
import { SalesNetworksService } from './sales-networks.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalesNetworksController],
  providers: [SalesNetworksService],
})
export class SalesNetworksModule {}
