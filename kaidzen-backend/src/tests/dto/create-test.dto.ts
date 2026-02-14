import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nextQuestionId?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  feedbackText?: string | null;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isTerminal?: boolean;
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isStartQuestion?: boolean;

  @ApiProperty({ type: [CreateOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreateTestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startQuestionId?: string | null;

  @ApiProperty({ type: [CreateQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
