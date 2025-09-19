import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateArticleDto {
  @ApiProperty({
    description: 'title',
    example: 'title',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Field()
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
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
    description: 'userId',
    example: 'userId',
  })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  userId: string;
}
