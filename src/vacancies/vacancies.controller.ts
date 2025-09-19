import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Res,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Condition, District, Education } from '@prisma/client';
import express from 'express';
import { GetVacancyDto } from './dto/get-vacancy.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { MvcExceptionFilter } from '../filters/mvc-exception.filter';
import { NotificationService } from '../notification/notification.service';

@ApiExcludeController()
@Controller('vacancies')
@UseFilters(MvcExceptionFilter)
export class VacanciesController {
  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/create')
  @Render('vacancies/create')
  @UseGuards(AuthGuard)
  showCreateForm(@GetUser() user: User) {
    return {
      title: 'Создание вакансии',
      username: user?.name,
      districts: Object.values(District),
      education: Object.values(Education),
      condition: Object.values(Condition),
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createVacancyDto: CreateVacancyDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const vacancy = await this.vacanciesService.create(
      createVacancyDto,
      user?.id,
      user?.role,
    );
    this.notificationService.created('vacancies', vacancy.title);
    return res.redirect(`vacancies/${vacancy.id}`);
  }

  @Get()
  @Render('vacancies/index')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query() getVacancyDto: GetVacancyDto,
    @GetUser() user: User,
  ) {
    const limit = 6;

    const result = await this.vacanciesService.findAllPaginated(
      page,
      limit,
      getVacancyDto,
    );

    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      hot_vacancies: result.hot_vacancies,
      latest_vacancies: result.latest_vacancies,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      title: 'Все вакансии',
      active_vacancy: 'active',
      username: user?.name,
      districts: Object.values(District),
      education: Object.values(Education),
      condition: Object.values(Condition),
    };
  }

  @Get(':id')
  @Render('vacancies/id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const vacancy = await this.vacanciesService.findById(id);

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    return {
      vacancy: vacancy,
      username: user?.name,
    };
  }

  @Get(':id/edit')
  @Render('vacancies/edit')
  @UseGuards(AuthGuard)
  async showEditForm(@Param('id') id: string, @GetUser() user: User) {
    const vacancy = await this.vacanciesService.findById(id);

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    return {
      vacancy,
      title: `Редактировать: ${vacancy.title}`,
      districts: Object.values(District),
      education: Object.values(Education),
      condition: Object.values(Condition),
      username: user?.name,
    };
  }

  @Post(':id/edit')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateVacancyDto: UpdateVacancyDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const vacancy = await this.vacanciesService.update(
      id,
      updateVacancyDto,
      user?.id,
      user?.role,
    );
    this.notificationService.updated('vacancies', vacancy.title);
    return res.redirect(`/vacancies/${id}`);
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const vacancy = await this.vacanciesService.delete(
      id,
      user?.id,
      user?.role,
    );
    this.notificationService.deleted('vacancies', vacancy.title);
    return res.redirect(`/vacancies`);
  }
}
