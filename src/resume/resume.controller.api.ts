import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { GetResumeDto } from './dto/get-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeDto } from './dto/resume.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiExceptionFilter } from '../filters/api-exception.filter';

@ApiTags('resume')
@Controller('api/resume')
@UseFilters(ApiExceptionFilter)
export class ResumeApiController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createResumeDto: CreateResumeDto,
    @GetUser() user: User,
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

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query() getResumeDto: GetResumeDto,
  ) {
    try {
      const limit = 6;

      const result = await this.resumeService.findAllPaginated(
        page,
        limit,
        getResumeDto,
      );

      return result.resume_list_priorities
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
        );
    } catch (error) {
      console.error('Error while getting resume:', error);
      return {
        error: 'Произошла ошибка при загрузке резюме',
        title: 'Ошибка сервера',
        resume_list_priorities: [],
        resume_list: [],
        pagination: null,
        active_resume: 'active',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const resume = await this.resumeService.findById(id);

    if (!resume) {
      return {
        error: 'Резюме не найдено',
        title: 'Ошибка 404',
      };
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @GetUser() user: User,
  ) {
    const resume = await this.resumeService.update(
      id,
      updateResumeDto,
      user?.id,
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    const resume = await this.resumeService.remove(id, user?.id);
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
