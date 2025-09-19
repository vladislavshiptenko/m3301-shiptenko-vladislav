import { CreateArticleDto } from './create-article.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
