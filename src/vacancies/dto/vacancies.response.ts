import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { VacancyDto } from './vacancy.dto';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class VacanciesResponse {
  constructor(vacancies: VacancyDto[], total: number) {
    this.vacancies = vacancies;
    this.total = total;
  }

  @ApiProperty({
    description: 'vacancies',
    example: '[{ id: "id", "title": "title" }]',
  })
  @IsNotEmpty()
  @Field(() => [VacancyDto])
  vacancies: VacancyDto[];

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
