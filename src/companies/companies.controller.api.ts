import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyDto } from './dto/company.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiExceptionFilter } from '../filters/api-exception.filter';

@ApiTags('companies')
@Controller('api/companies')
@UseFilters(ApiExceptionFilter)
export class CompaniesApiController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: User,
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

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    try {
      const limit = 6;

      const result = await this.companiesService.findAllPaginated(page, limit);

      return result.companies.map(
        (company) =>
          new CompanyDto(
            company.id,
            company.name,
            company.description,
            company.createdAt,
            company.image,
          ),
      );
    } catch (error) {
      console.error('Ошибка при получении компаний:', error);
      return {
        error: 'Произошла ошибка при загрузке компаний',
        title: 'Ошибка сервера',
        companies: [],
        pagination: null,
        active_company: 'active',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companiesService.findById(id);

    if (!company) {
      return {
        error: 'Компания не найдена',
        title: 'Ошибка 404',
      };
    }

    return new CompanyDto(
      company.id,
      company.name,
      company.description,
      company.createdAt,
      company.image,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: User,
  ) {
    const company = await this.companiesService.update(
      id,
      updateCompanyDto,
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    const company = await this.companiesService.delete(id, user?.id);
    return new CompanyDto(
      company.id,
      company.name,
      company.description,
      company.createdAt,
      company.image,
    );
  }
}
