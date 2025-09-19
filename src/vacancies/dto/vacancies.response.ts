import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { VacancyDto } from './vacancy.dto';

@ObjectType()
export class VacanciesResponse {
  constructor(vacancies: VacancyDto[], total: number) {
    this.vacancies = vacancies;
    this.total = total;
  }

  @IsNotEmpty()
  @Field(() => [VacancyDto])
  vacancies: VacancyDto[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
