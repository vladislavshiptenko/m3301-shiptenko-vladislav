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
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ResumeDto {
  constructor(
    id: string,
    title: string,
    minPrice: number,
    maxPrice: number,
    phoneNumber: string,
    district: District,
    education: Education,
    condition: Condition,
    createdAt: Date,
    description?: string | null,
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

  @ApiProperty({
    description: 'id',
    example: 'id',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string;

  @ApiProperty({
    description: 'title',
    example: 'title',
  })
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  description?: string | null;

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
    description: 'createdAt',
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;
}
