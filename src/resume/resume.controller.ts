import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Res,
  Param,
  UseGuards,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { GetResumeDto } from './dto/get-resume.dto';
import express from 'express';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Condition, District, Education } from '@prisma/client';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { MvcExceptionFilter } from '../filters/mvc-exception.filter';
import { NotificationService } from '../notification/notification.service';

@ApiExcludeController()
@Controller('resume')
@UseFilters(MvcExceptionFilter)
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/create')
  @Render('resume/create')
  @UseGuards(AuthGuard)
  showCreateForm(@GetUser() user: User) {
    return {
      title: 'Создание резюме',
      districts: Object.values(District),
      education: Object.values(Education),
      condition: Object.values(Condition),
      username: user?.name,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createResumeDto: CreateResumeDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const resume = await this.resumeService.create(createResumeDto, user?.id);
    this.notificationService.created('resume', resume.title);
    return res.redirect(`resume/${resume.id}`);
  }

  @Get()
  @Render('resume/index')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query() getResumeDto: GetResumeDto,
    @GetUser() user: User,
  ) {
    const limit = 6;

    const result = await this.resumeService.findAllPaginated(
      page,
      limit,
      getResumeDto,
    );

    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      resume_list_priorities: result.resume_list_priorities,
      resume_list: result.resume_list,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      title: 'Все резюме',
      active_resume: 'active',
      username: user?.name,
      districts: Object.values(District),
      education: Object.values(Education),
      condition: Object.values(Condition),
    };
  }

  @Get(':id')
  @Render('resume/id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const resume = await this.resumeService.findById(id);

    if (!resume) {
      throw new NotFoundException('Резюме не найдено');
    }

    return {
      resume: resume,
      username: user?.name,
    };
  }

  @Get(':id/edit')
  @Render('resume/edit')
  @UseGuards(AuthGuard)
  async showEditForm(@Param('id') id: string, @GetUser() user: User) {
    const resume = await this.resumeService.findById(id);

    if (!resume) {
      throw new NotFoundException('Резюме не найдено');
    }

    return {
      resume,
      title: `Редактировать: ${resume.title}`,
      username: user?.name,
      districts: Object.values(District),
      education: Object.values(Education),
      condition: Object.values(Condition),
    };
  }

  @Post(':id/edit')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const resume = await this.resumeService.update(
      id,
      updateResumeDto,
      user?.id,
      user?.role,
    );
    this.notificationService.updated('resume', resume.title);
    return res.redirect(`/resume/${id}`);
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const resume = await this.resumeService.remove(id, user?.id, user?.role);
    this.notificationService.deleted('resume', resume.title);
    return res.redirect(`/resume`);
  }
}
