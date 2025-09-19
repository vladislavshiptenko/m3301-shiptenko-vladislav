import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ArticleDto {
  constructor(
    id: string,
    title: string,
    description: string,
    createdAt: Date,
    photoURL?: string | null,
  ) {
    this.id = id;
    this.description = description;
    this.title = title;
    this.photoURL = photoURL;
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
  @Field()
  description: string;

  @ApiProperty({
    description: 'photoURL',
    example: 'photoURL',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  photoURL?: string | null;

  @ApiProperty({
    description: 'createdAt',
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;
}
