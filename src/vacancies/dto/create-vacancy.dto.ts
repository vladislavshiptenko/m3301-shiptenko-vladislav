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
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateVacancyDto {
  @ApiProperty({
    description: 'title',
    example: 'title',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Field()
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Field()
  description: string;

  @ApiProperty({
    description: 'minPrice',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  minPrice: number;

  @ApiProperty({
    description: 'maxPrice',
    example: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  maxPrice: number;

  @ApiProperty({
    description: 'phoneNumber',
    example: '+79527771471',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  @Field()
  phoneNumber: string;

  @ApiProperty({
    description: 'district',
    example: 'Soviet',
  })
  @IsEnum(District, { message: 'Неверный район' })
  @Field()
  district: District;

  @ApiProperty({
    description: 'education',
    example: 'Student',
  })
  @IsEnum(Education, { message: 'Неверное образование' })
  @Field()
  education: Education;

  @ApiProperty({
    description: 'condition',
    example: 'Remote',
  })
  @IsEnum(Condition, { message: 'Неверный график' })
  @Field()
  condition: Condition;

  @ApiProperty({
    description: 'companyName',
    example: 'companyName',
  })
  @IsString()
  @IsNotEmpty()
  @Field()
  companyName: string;
}
