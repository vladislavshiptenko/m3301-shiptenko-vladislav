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
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { GetVacancyDto } from './dto/get-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyDto } from './dto/vacancy.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { CacheControl } from '../decorators/cache-control.decorator';
import { VacanciesResponse } from './dto/vacancies.response';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiExceptionFilter } from '../filters/api-exception.filter';

@ApiTags('vacancies')
@Controller('api/vacancies')
@UseFilters(ApiExceptionFilter)
export class VacanciesApiController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Вакансия создана',
    type: VacancyDto,
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
  @UseGuards(AuthGuard)
  async create(
    @Body() createVacancyDto: CreateVacancyDto,
    @GetUser() user: User,
  ) {
    const vacancy = await this.vacanciesService.create(
      createVacancyDto,
      user?.id,
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

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Вакансии найдены',
    type: VacanciesResponse,
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
  @CacheControl({
    public: true,
    maxAge: 3600,
    mustRevalidate: true,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query()
    getVacancyDto: GetVacancyDto,
  ) {
    const limit = 6;

    const result = await this.vacanciesService.findAllPaginated(
      page,
      limit,
      getVacancyDto,
    );

    const vacancies = result.hot_vacancies
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
      );

    return new VacanciesResponse(vacancies, result.total);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Вакансия найдена',
    type: VacancyDto,
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
  @CacheControl({
    public: true,
    maxAge: 3600,
    mustRevalidate: true,
  })
  async findOne(@Param('id') id: string) {
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

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Вакансия обновлена',
    type: VacancyDto,
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
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateVacancyDto: UpdateVacancyDto,
    @GetUser() user: User,
  ) {
    const vacancy = await this.vacanciesService.update(
      id,
      updateVacancyDto,
      user?.id,
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

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Вакансия удалена',
    type: VacancyDto,
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
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    const vacancy = await this.vacanciesService.delete(id, user?.id);
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
