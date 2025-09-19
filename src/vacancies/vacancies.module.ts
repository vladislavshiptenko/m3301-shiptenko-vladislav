import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { CompaniesModule } from '../companies/companies.module';
import { VacanciesApiController } from './vacancies.controller.api';
import { VacanciesResolver } from './vacancies.resolver';

@Module({
  imports: [CompaniesModule],
  controllers: [VacanciesController, VacanciesApiController],
  providers: [VacanciesService, VacanciesResolver],
  exports: [VacanciesService],
})
export class VacanciesModule {}
