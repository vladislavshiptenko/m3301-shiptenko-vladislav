import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Field, ID, ObjectType } from '@nestjs/graphql';

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

  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string | null;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;
}
