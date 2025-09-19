import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { GetVacancyDto } from './dto/get-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyDto } from './dto/vacancy.dto';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VacanciesResponse } from './dto/vacancies.response';
import { GetUserGQL } from '../decorators/get-user-gql.decorator';
import { User } from '../auth/entities/user.entity';
import { GraphQLAuthGuard } from '../guards/graphql-auth.guard';
import { GraphQLExceptionFilter } from '../filters/graphql-exception.filter';

@Resolver(() => VacancyDto)
@UseFilters(GraphQLExceptionFilter)
export class VacanciesResolver {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Mutation(() => VacancyDto, { description: 'Создание новой вакансии' })
  @UseGuards(GraphQLAuthGuard)
  async createVacancy(
    @Args('createVacancyInput') createVacancyDto: CreateVacancyDto,
    @GetUserGQL() user: User,
  ) {
    const vacancy = await this.vacanciesService.create(
      createVacancyDto,
      user?.id,
      user?.role,
    );
    return new VacancyDto(
      vacancy.id,
      vacancy.title,
      vacancy.description,
      vacancy.createdAt,
      vacancy.minPrice,
      vacancy.maxPrice,
      vacancy.phoneNumber,
      vacancy.district,
      vacancy.education,
      vacancy.condition,
    );
  }

  @Query(() => VacanciesResponse, {
    description: 'Получение списка вакансий с пагинацией',
  })
  async vacancies(
    @Args('page', { type: () => Int, defaultValue: 1 })
    page: number,
    @Args('getVacancyInput')
    getVacancyDto: GetVacancyDto,
  ) {
    const limit = 6;

    const result = await this.vacanciesService.findAllPaginated(
      page,
      limit,
      getVacancyDto,
    );

    return new VacanciesResponse(
      result.hot_vacancies
        .concat(result.latest_vacancies)
        .map(
          (vacancy) =>
            new VacancyDto(
              vacancy.id,
              vacancy.title,
              vacancy.description,
              vacancy.createdAt,
              vacancy.minPrice,
              vacancy.maxPrice,
              vacancy.phoneNumber,
              vacancy.district,
              vacancy.education,
              vacancy.condition,
            ),
        ),
      result.total,
    );
  }

  @Query(() => VacancyDto, { description: 'Получение вакансии по ID' })
  async vacancy(@Args('id', { type: () => ID }) id: string) {
    const vacancy = await this.vacanciesService.findById(id);

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    return new VacancyDto(
      vacancy.id,
      vacancy.title,
      vacancy.description,
      vacancy.createdAt,
      vacancy.minPrice,
      vacancy.maxPrice,
      vacancy.phoneNumber,
      vacancy.district,
      vacancy.education,
      vacancy.condition,
    );
  }

  @Mutation(() => VacancyDto, { description: 'Обновление вакансии' })
  @UseGuards(GraphQLAuthGuard)
  async updateVacancy(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateVacancyInput') updateVacancyDto: UpdateVacancyDto,
    @GetUserGQL() user: User,
  ) {
    const vacancy = await this.vacanciesService.update(
      id,
      updateVacancyDto,
      user?.id,
      user?.role,
    );
    return new VacancyDto(
      vacancy.id,
      vacancy.title,
      vacancy.description,
      vacancy.createdAt,
      vacancy.minPrice,
      vacancy.maxPrice,
      vacancy.phoneNumber,
      vacancy.district,
      vacancy.education,
      vacancy.condition,
    );
  }

  @Mutation(() => VacancyDto, { description: 'Удаление вакансии' })
  @UseGuards(GraphQLAuthGuard)
  async deleteVacancy(
    @Args('id', { type: () => ID }) id: string,
    @GetUserGQL() user: User,
  ) {
    const vacancy = await this.vacanciesService.delete(
      id,
      user?.id,
      user?.role,
    );
    return new VacancyDto(
      vacancy.id,
      vacancy.title,
      vacancy.description,
      vacancy.createdAt,
      vacancy.minPrice,
      vacancy.maxPrice,
      vacancy.phoneNumber,
      vacancy.district,
      vacancy.education,
      vacancy.condition,
    );
  }
}
