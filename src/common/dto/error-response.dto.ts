import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  constructor(code: number, description: string) {
    this.code = code;
    this.description = description;
  }

  @ApiProperty({
    description: 'code',
    example: '400',
  })
  code: number;

  @ApiProperty({
    description: 'description',
    example: 'description',
  })
  description: string;
}
