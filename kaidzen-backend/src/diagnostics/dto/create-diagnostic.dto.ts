import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDiagnosticDto {
  @ApiProperty({ example: 'Diagnostika 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
