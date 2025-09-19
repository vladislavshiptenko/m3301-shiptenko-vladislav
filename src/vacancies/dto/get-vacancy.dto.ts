import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Condition, District, Education } from '@prisma/client';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class GetVacancyDto {
  @ApiProperty({
    description: 'district',
    example: 'Soviet',
  })
  @IsOptional()
  @IsEnum(District, { message: 'Неверный район' })
  @Field(() => District, { nullable: true })
  district?: District;

  @ApiProperty({
    description: 'condition',
    example: 'Remote',
  })
  @IsOptional()
  @IsEnum(Condition, { message: 'Неверный график' })
  @Field(() => Condition, { nullable: true })
  condition?: Condition;

  @ApiProperty({
    description: 'education',
    example: 'Student',
  })
  @IsOptional()
  @IsEnum(Education, { message: 'Неверное образование' })
  @Field(() => Education, { nullable: true })
  education?: Education;

  @ApiProperty({
    description: 'title',
    example: 'title',
  })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;
}
