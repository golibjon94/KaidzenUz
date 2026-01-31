import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  problem: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  solution: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  result: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
