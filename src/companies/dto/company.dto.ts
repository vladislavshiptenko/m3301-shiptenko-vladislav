import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class CompanyDto {
  constructor(
    id: string,
    name: string,
    description: string,
    createdAt: Date,
    image?: string | null,
  ) {
    this.id = id;
    this.description = description;
    this.name = name;
    this.image = image;
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
    description: 'name',
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @ApiProperty({
    description: 'image',
    example: 'image',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string | null;

  @ApiProperty({
    description: 'description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @ApiProperty({
    description: 'createdAt',
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;
}
