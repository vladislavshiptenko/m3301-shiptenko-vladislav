import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { CompanyDto } from './company.dto';
import { Type } from 'class-transformer';

@ObjectType()
export class CompaniesResponse {
  constructor(companies: CompanyDto[], total: number) {
    this.companies = companies;
    this.total = total;
  }

  @IsNotEmpty()
  @Field(() => [CompanyDto])
  companies: CompanyDto[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
