import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Condition, District, Education } from '@prisma/client';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetResumeDto {
  @IsOptional()
  @IsEnum(District, { message: 'Неверный район' })
  @Field(() => District, { nullable: true })
  district?: District;

  @IsOptional()
  @IsEnum(Condition, { message: 'Неверный график' })
  @Field(() => Condition, { nullable: true })
  condition?: Condition;

  @IsOptional()
  @IsEnum(Education, { message: 'Неверное образование' })
  @Field(() => Education, { nullable: true })
  education?: Education;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;
}
