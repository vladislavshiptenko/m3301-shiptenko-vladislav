import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class UserDto {
  constructor(
    id: string,
    name: string,
    email: string,
    createdAt: Date,
    image?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
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
    description: 'email',
    example: 'email',
  })
  @IsEmail()
  @Field()
  email: string;

  @ApiProperty({
    description: 'image',
    example: 'image',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  image?: string | null;

  @ApiProperty({
    description: 'createdAt',
    example: new Date(),
  })
  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;
}
