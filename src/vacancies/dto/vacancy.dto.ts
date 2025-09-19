import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Condition, District, Education } from '@prisma/client';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VacancyDto {
  constructor(
    id: string,
    title: string,
    description: string | null,
    createdAt: Date,
    minPrice: number,
    maxPrice: number,
    phoneNumber: string,
    district: District,
    education: Education,
    condition: Condition,
  ) {
    this.id = id;
    this.description = description;
    this.title = title;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.phoneNumber = phoneNumber;
    this.district = district;
    this.education = education;
    this.condition = condition;
    this.createdAt = createdAt;
  }

  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  description?: string | null;

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

  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;
}
