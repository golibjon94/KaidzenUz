import { IsNotEmpty, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitTestDto {
  @ApiProperty({ example: 'test-uuid' })
  @IsString()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({ example: [{ questionId: 'q1', optionId: 'o1' }] })
  @IsArray()
  @IsNotEmpty()
  answers: { questionId: string; optionId: string }[];
}
