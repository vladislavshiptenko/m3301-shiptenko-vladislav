import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ResumeDto } from './resume.dto';

@ObjectType()
export class ResumeResponse {
  constructor(resume: ResumeDto[], total: number) {
    this.resume = resume;
    this.total = total;
  }

  @IsNotEmpty()
  @Field(() => [ResumeDto])
  resume: ResumeDto[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
