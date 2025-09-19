import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { CompanyDto } from './company.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class CompaniesResponse {
  constructor(companies: CompanyDto[], total: number) {
    this.companies = companies;
    this.total = total;
  }

  @ApiProperty({
    description: 'companies',
    example: '[{ id: "id", "name": "name" }]',
  })
  @IsNotEmpty()
  @Field(() => [CompanyDto])
  companies: CompanyDto[];

  @ApiProperty({
    description: 'total',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
