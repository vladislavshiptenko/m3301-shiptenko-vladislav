import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyDto } from './dto/company.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiExceptionFilter } from '../filters/api-exception.filter';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { CompaniesResponse } from './dto/companies.response';

@ApiTags('companies')
@Controller('api/companies')
@UseFilters(ApiExceptionFilter)
export class CompaniesApiController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Компания создана',
    type: CompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Ошибка авторизации',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка',
    type: ErrorResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Компании найдены',
    type: CompaniesResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка',
    type: ErrorResponseDto,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
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

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Компания найдена',
    type: CompanyDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Не найдено',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string) {
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Компания обновлена',
    type: CompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Ошибка авторизации',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Не найдено',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка',
    type: ErrorResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Компания удалена',
    type: CompanyDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Ошибка авторизации',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Не найдено',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка',
    type: ErrorResponseDto,
  })
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
