import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Delete,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import type { Response } from 'express';
import { FileService } from './file.service';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Files')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post('upload')
  @ApiOperation({ summary: 'Upload a file (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
          return callback(new BadRequestException('Faqat rasm va hujjat fayllari ruxsat etilgan!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a file by ID (Public)' })
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.getFileById(id);
    const filePath = join(process.cwd(), 'uploads', file.filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Fayl topilmadi');
    }
    return res.sendFile(filePath);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete(':filename')
  @ApiOperation({ summary: 'Delete a file (Admin only)' })
  remove(@Param('filename') filename: string) {
    return this.fileService.deleteFile(filename);
  }
}
