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
  UseGuards,
  NotFoundException,
  UseFilters,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import express from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { MvcExceptionFilter } from '../filters/mvc-exception.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { NotificationService } from '../notification/notification.service';

@ApiExcludeController()
@Controller('companies')
@UseFilters(MvcExceptionFilter)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/create')
  @Render('companies/create')
  @UseGuards(AuthGuard)
  showCreateForm(@GetUser() user: User) {
    return {
      title: 'Создать компанию',
      username: user?.name,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: User,
    @Res() res: express.Response,
  ) {
    const company = await this.companiesService.create(
      createCompanyDto,
      user?.id,
    );
    this.notificationService.created('companies', company.name);
    return res.redirect(`/companies/${company.id}`);
  }

  @Get()
  @Render('companies/index')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @GetUser() user: User,
  ) {
    const limit = 6;

    const result = await this.companiesService.findAllPaginated(page, limit);

    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      companies: result.companies,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      title: 'Все компании',
      username: user?.name,
      active_company: 'active',
    };
  }

  @Get(':id')
  @Render('companies/id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const company = await this.companiesService.findById(id);

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    return {
      company: company,
      username: user?.name,
    };
  }

  @Get(':id/edit')
  @Render('companies/edit')
  @UseGuards(AuthGuard)
  async showEditForm(@Param('id') id: string, @GetUser() user: User) {
    const company = await this.companiesService.findById(id);

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    return {
      company,
      title: `Редактировать: ${company.name}`,
      username: user?.name,
    };
  }

  @Post(':id/edit')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const company = await this.companiesService.update(
      id,
      updateCompanyDto,
      user?.id,
      user?.role,
    );
    this.notificationService.updated('companies', company.name);
    return res.redirect(`/companies/${id}`);
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    const company = await this.companiesService.delete(
      id,
      user?.id,
      user?.role,
    );
    this.notificationService.deleted('companies', company.name);
    return res.redirect(`/companies`);
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
      folder: `companies/${id}/avatars`,
      generateUniqueKey: true,
    });

    const company = await this.companiesService.updateAvatar(
      id,
      result.url,
      user?.id,
      user?.role,
    );
    this.notificationService.created('companies', `${company.name} photo`);
  }
}
