import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Condition, District, Education } from '@prisma/client';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateVacancyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Field()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Field()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  minPrice: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  maxPrice: number;

  @IsPhoneNumber()
  @IsNotEmpty()
  @Field()
  phoneNumber: string;

  @IsEnum(District, { message: 'Неверный район' })
  @Field()
  district: District;

  @IsEnum(Education, { message: 'Неверное образование' })
  @Field()
  education: Education;

  @IsEnum(Condition, { message: 'Неверный график' })
  @Field()
  condition: Condition;

  @IsString()
  @IsNotEmpty()
  @Field()
  companyName: string;
}
