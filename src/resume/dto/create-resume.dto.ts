import {
  IsString,
  IsNumber,
  IsPhoneNumber,
  MaxLength,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Condition, District, Education } from '@prisma/client';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateResumeDto {
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

  @IsOptional()
  @Field(() => String, { nullable: true })
  userId: string;
}
