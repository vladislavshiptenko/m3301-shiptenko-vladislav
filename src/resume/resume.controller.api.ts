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
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { GetResumeDto } from './dto/get-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeDto } from './dto/resume.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiExceptionFilter } from '../filters/api-exception.filter';
import { ResumeResponse } from './dto/resume.response';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('resume')
@Controller('api/resume')
@UseFilters(ApiExceptionFilter)
export class ResumeApiController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Резюме создано',
    type: ResumeDto,
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
  @ApiResponse({
    status: 200,
    description: 'Резюме найдены',
    type: ResumeResponse,
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
    @Query() getResumeDto: GetResumeDto,
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

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Резюме найдено',
    type: ResumeDto,
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Резюме обновлено',
    type: ResumeDto,
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
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @GetUser() user: User,
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Статья удалена',
    type: ResumeDto,
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
  async remove(@Param('id') id: string, @GetUser() user: User) {
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
