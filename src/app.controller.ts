import { Controller, Get, Query, Render } from '@nestjs/common';
import { ArticlesService } from './articles/articles.service';
import { VacanciesService } from './vacancies/vacancies.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './auth/entities/user.entity';
import { NotificationService } from './notification/notification.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly vacanciesService: VacanciesService,
  ) {}

  @Get()
  @Render('pages/index')
  async getHome(@GetUser() user: User) {
    const { articles } = await this.articlesService.findAllPaginated(1, 6);
    const { hot_vacancies, latest_vacancies } =
      await this.vacanciesService.findAllPaginated(1, 6, undefined);

    return {
      title: 'Главная',
      articles: articles,
      username: user?.name,
      hot_vacancies: hot_vacancies,
      latest_vacancies: latest_vacancies,
    };
  }

  @Get('error')
  @Render('pages/error')
  showError(
    @Query('code') code: string = 'unknown',
    @Query('message') message: string = 'Произошла ошибка',
    @GetUser() user: User,
  ) {
    return {
      message: decodeURIComponent(message),
      code: code,
      title: 'Ошибка',
      username: user?.name,
    };
  }
}
