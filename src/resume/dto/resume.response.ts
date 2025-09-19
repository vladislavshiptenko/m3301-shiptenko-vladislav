import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ResumeDto } from './resume.dto';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ResumeResponse {
  constructor(resume: ResumeDto[], total: number) {
    this.resume = resume;
    this.total = total;
  }

  @ApiProperty({
    description: 'resume',
    example: '[{ id: "id", "title": "title" }]',
  })
  @IsNotEmpty()
  @Field(() => [ResumeDto])
  resume: ResumeDto[];

  @ApiProperty({
    description: 'total',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
