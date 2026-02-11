import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSalesNetworkDto {
  @ApiProperty({ example: 'Savdo tarmog‘i 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
