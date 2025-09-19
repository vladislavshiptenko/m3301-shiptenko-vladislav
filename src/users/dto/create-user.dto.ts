import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateUserDto {
  @ApiProperty({
    description: 'name',
    example: 'name',
  })
  @IsString()
  @MaxLength(100)
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
    description: 'password',
    example: 'password',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @Field()
  password: string;
}
