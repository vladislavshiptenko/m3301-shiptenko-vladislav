import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Field()
  name: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Field()
  description: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  ownerId: string;
}
