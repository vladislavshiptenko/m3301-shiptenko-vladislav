import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Article, Role } from '@prisma/client';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private database: DatabaseService) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<Article> {
    return this.database.article.create({
      data: {
        ...createArticleDto,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findById(id: string): Promise<Article | null> {
    return this.database.article.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      this.database.article.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          user: true,
          photoURL: true,
          createdAt: true,
        },
      }),

      this.database.article.count(),
    ]);

    return {
      articles,
      total,
    };
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
    role: string,
  ): Promise<Article> {
    const article = await this.findById(id);
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    if (article.userId != userId || role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async updatePhoto(
    id: string,
    url: string,
    userId: string,
    role: string,
  ): Promise<Article> {
    const article = await this.findById(id);
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    if (article.userId != userId || role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.article.update({
      where: { id },
      data: {
        photoURL: url,
      },
    });
  }

  async delete(id: string, userId: string, role: string): Promise<Article> {
    const article = await this.findById(id);
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    if (article.userId != userId || role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.article.delete({ where: { id } });
  }
}
