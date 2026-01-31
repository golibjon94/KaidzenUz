import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlogStatus } from '@prisma/client';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ required: false, description: 'File ID for image' })
  @IsUUID()
  @IsOptional()
  imageId?: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: BlogStatus, default: BlogStatus.DRAFT })
  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;
}
