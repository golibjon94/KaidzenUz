import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  salesNetworkId: string;
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
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
