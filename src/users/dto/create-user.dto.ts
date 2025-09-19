import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @IsString()
  @MaxLength(100)
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

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @Field()
  password: string;
}
