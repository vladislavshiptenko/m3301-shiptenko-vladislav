import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDto } from './dto/article.dto';
import { Args, ID, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ArticlesResponse } from './dto/articles.response';
import { GraphQLAuthGuard } from '../guards/graphql-auth.guard';
import { User } from '../auth/entities/user.entity';
import { GetUserGQL } from '../decorators/get-user-gql.decorator';
import { GraphQLExceptionFilter } from '../filters/graphql-exception.filter';

@Resolver(() => ArticleDto)
@UseFilters(GraphQLExceptionFilter)
export class ArticlesResolver {
  constructor(private readonly articlesService: ArticlesService) {}

  @Mutation(() => ArticleDto, { description: 'Создание новой статьи' })
  @UseGuards(GraphQLAuthGuard)
  async createArticle(
    @Args('createArticleInput') createArticleDto: CreateArticleDto,
    @GetUserGQL() user: User,
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

  @Query(() => ArticlesResponse, {
    description: 'Получение списка статей с пагинацией',
  })
  async articles(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
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

  @Query(() => ArticleDto, { description: 'Получение статьи по ID' })
  async article(@Args('id', { type: () => ID }) id: string) {
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

  @Mutation(() => ArticleDto, { description: 'Обновление статьи' })
  @UseGuards(GraphQLAuthGuard)
  async updateArticle(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateArticleInput') updateArticleDto: UpdateArticleDto,
    @GetUserGQL() user: User,
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

  @Mutation(() => ArticleDto, { description: 'Удаление статьи' })
  @UseGuards(GraphQLAuthGuard)
  async deleteArticle(
    @Args('id', { type: () => ID }) id: string,
    @GetUserGQL() user: User,
  ) {
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
