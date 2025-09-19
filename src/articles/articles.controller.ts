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
  NotFoundException,
  UseGuards,
  UseFilters,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import express from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { MvcExceptionFilter } from '../filters/mvc-exception.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { NotificationService } from '../notification/notification.service';

@ApiExcludeController()
@Controller('articles')
@UseFilters(MvcExceptionFilter)
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/create')
  @Render('articles/create')
  @UseGuards(AuthGuard)
  showCreateForm(@GetUser() user: User) {
    return {
      title: 'Создать статью',
      username: user?.name,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const articleWithUser = {
      ...createArticleDto,
      userId: user?.id,
    };

    const article = await this.articlesService.create(articleWithUser, user.id);
    this.notificationService.created('articles', article.title);
    return res.redirect(`/articles/${article.id}`);
  }

  @Get()
  @Render('articles/index')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @GetUser() user: User,
  ) {
    const limit = 6;

    const result = await this.articlesService.findAllPaginated(page, limit);

    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      articles: result.articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      title: 'Все статьи',
      username: user?.name,
    };
  }

  @Get(':id')
  @Render('articles/id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const article = await this.articlesService.findById(id);

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return {
      article: article,
      username: user?.name,
    };
  }

  @Get(':id/edit')
  @Render('articles/edit')
  @UseGuards(AuthGuard)
  async showEditForm(@Param('id') id: string, @GetUser() user: User) {
    const article = await this.articlesService.findById(id);

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return {
      article,
      title: `Редактировать: ${article.title}`,
      username: user?.name,
    };
  }

  @Post(':id/edit')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const article = await this.articlesService.update(
      id,
      updateArticleDto,
      user?.id,
      user?.role,
    );
    this.notificationService.updated('articles', article.title);
    return res.redirect(`/articles/${id}`);
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const article = await this.articlesService.delete(id, user?.id, user?.role);
    this.notificationService.deleted('articles', article.title);
    return res.redirect(`/articles`);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(AuthGuard)
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const result = await this.storageService.uploadFile(file, {
      folder: `articles/${id}/photo`,
      generateUniqueKey: true,
    });

    const article = await this.articlesService.updatePhoto(
      id,
      result.url,
      user?.id,
      user?.role,
    );
    this.notificationService.updated('articles', `${article.title} photo`);
  }
}
