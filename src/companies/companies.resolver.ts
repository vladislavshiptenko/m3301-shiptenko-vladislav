import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyDto } from './dto/company.dto';
import { Args, Int, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import { CompaniesResponse } from './dto/companies.response';
import { GraphQLAuthGuard } from '../guards/graphql-auth.guard';
import { GetUserGQL } from '../decorators/get-user-gql.decorator';
import { User } from '../auth/entities/user.entity';
import { GraphQLExceptionFilter } from '../filters/graphql-exception.filter';

@Resolver(() => CompanyDto)
@UseFilters(GraphQLExceptionFilter)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Mutation(() => CompanyDto, { description: 'Создание новой компании' })
  @UseGuards(GraphQLAuthGuard)
  async createCompany(
    @Args('createCompanyInput') createCompanyDto: CreateCompanyDto,
    @GetUserGQL() user: User,
  ) {
    const company = await this.companiesService.create(
      createCompanyDto,
      user?.id,
    );
    return new CompanyDto(
      company.id,
      company.name,
      company.description,
      company.createdAt,
      company.image,
    );
  }

  @Query(() => CompaniesResponse, {
    description: 'Получение списка компаний с пагинацией',
  })
  async companies(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
  ) {
    const limit = 6;

    const result = await this.companiesService.findAllPaginated(page, limit);

    return new CompaniesResponse(
      result.companies.map(
        (company) =>
          new CompanyDto(
            company.id,
            company.name,
            company.description,
            company.createdAt,
            company.image,
          ),
      ),
      result.total,
    );
  }

  @Query(() => CompanyDto, { description: 'Получение компании по ID' })
  async company(@Args('id', { type: () => ID }) id: string) {
    const company = await this.companiesService.findById(id);

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    return new CompanyDto(
      company.id,
      company.name,
      company.description,
      company.createdAt,
      company.image,
    );
  }

  @Mutation(() => CompanyDto, { description: 'Обновление компании' })
  @UseGuards(GraphQLAuthGuard)
  async updateCompany(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCompanyInput') updateCompanyDto: UpdateCompanyDto,
    @GetUserGQL() user: User,
  ) {
    const company = await this.companiesService.update(
      id,
      updateCompanyDto,
      user?.id,
      user?.role,
    );
    return new CompanyDto(
      company.id,
      company.name,
      company.description,
      company.createdAt,
      company.image,
    );
  }

  @Mutation(() => CompanyDto, { description: 'Удаление компании' })
  @UseGuards(GraphQLAuthGuard)
  async deleteCompany(
    @Args('id', { type: () => ID }) id: string,
    @GetUserGQL() user: User,
  ) {
    const company = await this.companiesService.delete(
      id,
      user?.id,
      user?.role,
    );
    return new CompanyDto(
      company.id,
      company.name,
      company.description,
      company.createdAt,
      company.image,
    );
  }
}
