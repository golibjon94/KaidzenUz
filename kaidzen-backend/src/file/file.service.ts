import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }
    
    // Aslida fayl Multer orqali allaqachon uploads papkasiga saqlangan bo'ladi.
    // Biz faqat uning URL manzili (yoki path) qaytaramiz.
    // Main.ts da statik fayllar uchun 'uploads' papkasini ochishimiz kerak.
    
    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }

  async deleteFile(filename: string) {
    const filePath = `./uploads/${filename}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, message: 'Fayl topilmadi' };
  }
}
