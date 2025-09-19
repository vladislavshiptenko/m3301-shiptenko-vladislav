import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { ArticleDto } from './article.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ArticlesResponse {
  constructor(articles: ArticleDto[], total: number) {
    this.articles = articles;
    this.total = total;
  }

  @ApiProperty({
    description: 'articles',
    example: '[{ id: "id", "title": "title" }]',
  })
  @IsNotEmpty()
  @Field(() => [ArticleDto])
  articles: ArticleDto[];

  @ApiProperty({
    description: 'total',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
