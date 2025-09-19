import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { GetResumeDto } from './dto/get-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeDto } from './dto/resume.dto';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ResumeResponse } from './dto/resume.response';
import { GetUserGQL } from '../decorators/get-user-gql.decorator';
import { User } from '../auth/entities/user.entity';
import { GraphQLAuthGuard } from '../guards/graphql-auth.guard';
import { GraphQLExceptionFilter } from '../filters/graphql-exception.filter';

@Resolver(() => ResumeDto)
@UseFilters(GraphQLExceptionFilter)
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}

  @Mutation(() => ResumeDto, { description: 'Создание нового резюме' })
  @UseGuards(GraphQLAuthGuard)
  async createResume(
    @Args('createResumeInput') createResumeDto: CreateResumeDto,
    @GetUserGQL() user: User,
  ) {
    const resume = await this.resumeService.create(createResumeDto, user?.id);
    return new ResumeDto(
      resume.id,
      resume.title,
      resume.minPrice,
      resume.maxPrice,
      resume.phoneNumber,
      resume.district,
      resume.education,
      resume.condition,
      resume.createdAt,
      resume.description,
    );
  }

  @Query(() => ResumeDto, {
    description: 'Получение списка резюме с пагинацией',
  })
  async resumes(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('getResumeInput') getResumeDto: GetResumeDto,
  ) {
    const limit = 6;

    const result = await this.resumeService.findAllPaginated(
      page,
      limit,
      getResumeDto,
    );

    return new ResumeResponse(
      result.resume_list_priorities
        .concat(result.resume_list)
        .map(
          (resume) =>
            new ResumeDto(
              resume.id,
              resume.title,
              resume.minPrice,
              resume.maxPrice,
              resume.phoneNumber,
              resume.district,
              resume.education,
              resume.condition,
              resume.createdAt,
              resume.description,
            ),
        ),
      result.total,
    );
  }

  @Query(() => ResumeDto, { description: 'Получение резюме по ID' })
  async resume(@Args('id', { type: () => ID }) id: string) {
    const resume = await this.resumeService.findById(id);

    if (!resume) {
      throw new NotFoundException('Резюме не найдено');
    }

    return new ResumeDto(
      resume.id,
      resume.title,
      resume.minPrice,
      resume.maxPrice,
      resume.phoneNumber,
      resume.district,
      resume.education,
      resume.condition,
      resume.createdAt,
      resume.description,
    );
  }

  @Mutation(() => ResumeDto, { description: 'Обновление резюме' })
  @UseGuards(GraphQLAuthGuard)
  async updateResume(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateResumeInput') updateResumeDto: UpdateResumeDto,
    @GetUserGQL() user: User,
  ) {
    const resume = await this.resumeService.update(
      id,
      updateResumeDto,
      user?.id,
      user?.role,
    );
    return new ResumeDto(
      resume.id,
      resume.title,
      resume.minPrice,
      resume.maxPrice,
      resume.phoneNumber,
      resume.district,
      resume.education,
      resume.condition,
      resume.createdAt,
      resume.description,
    );
  }

  @Mutation(() => ResumeDto, { description: 'Удаление резюме' })
  @UseGuards(GraphQLAuthGuard)
  async deleteResume(
    @Args('id', { type: () => ID }) id: string,
    @GetUserGQL() user: User,
  ) {
    const resume = await this.resumeService.remove(id, user?.id, user?.role);
    return new ResumeDto(
      resume.id,
      resume.title,
      resume.minPrice,
      resume.maxPrice,
      resume.phoneNumber,
      resume.district,
      resume.education,
      resume.condition,
      resume.createdAt,
      resume.description,
    );
  }
}
