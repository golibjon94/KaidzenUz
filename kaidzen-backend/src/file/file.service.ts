import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }

    const savedFile = await this.prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
      },
    });

    return {
      id: savedFile.id,
      filename: savedFile.filename,
      originalName: savedFile.originalName,
      mimetype: savedFile.mimetype,
      size: savedFile.size,
      url: savedFile.path,
    };
  }

  async getFileById(id: string) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException('Fayl topilmadi');
    }
    return file;
  }

  async deleteFile(filename: string) {
    const filePath = `./uploads/${filename}`;
    
    // DB dan ham o'chirish
    await this.prisma.file.deleteMany({ where: { filename } });
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, message: 'Fayl topilmadi' };
  }
}
