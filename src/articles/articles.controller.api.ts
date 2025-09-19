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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDto } from './dto/article.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { ArticlesResponse } from './dto/articles.response';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { ApiExceptionFilter } from '../filters/api-exception.filter';

@ApiTags('articles')
@Controller('api/articles')
@UseFilters(ApiExceptionFilter)
export class ArticlesApiController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Статья создана',
    type: ArticleDto,
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
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ) {
    const article = await this.articlesService.create(
      createArticleDto,
      user?.id,
    );
    return new ArticleDto(
      article.id,
      article.title,
      article.description,
      article.createdAt,
      article.photoURL,
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Статьи найдены',
    type: ArticlesResponse,
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

    const result = await this.articlesService.findAllPaginated(page, limit);

    return new ArticlesResponse(
      result.articles.map(
        (article) =>
          new ArticleDto(
            article.id,
            article.title,
            article.description,
            article.createdAt,
            article.photoURL,
          ),
      ),
      result.total,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Статья найдена',
    type: ArticleDto,
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
    const article = await this.articlesService.findById(id);

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return new ArticleDto(
      article.id,
      article.title,
      article.description,
      article.createdAt,
      article.photoURL,
    );
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Статья обновлена',
    type: ArticleDto,
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
    @Body() updateArticleDto: UpdateArticleDto,
    @GetUser() user: User,
  ) {
    const article = await this.articlesService.update(
      id,
      updateArticleDto,
      user?.id,
      user?.role,
    );
    return new ArticleDto(
      article.id,
      article.title,
      article.description,
      article.createdAt,
      article.photoURL,
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Статья удалена',
    type: ArticleDto,
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
    const article = await this.articlesService.delete(id, user?.id, user?.role);
    return new ArticleDto(
      article.id,
      article.title,
      article.description,
      article.createdAt,
      article.photoURL,
    );
  }
}
