import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, ID, ObjectType } from '@nestjs/graphql';

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

  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  image?: string | null;

  @IsDate()
  @IsNotEmpty()
  @Field()
  createdAt: Date;
}
