import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateCompanyDto {
  @ApiProperty({
    description: 'name',
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
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
  @MaxLength(1000)
  @Field()
  description: string;

  @ApiProperty({
    description: 'ownerId',
    example: 'ownerId',
  })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  ownerId: string;
}
