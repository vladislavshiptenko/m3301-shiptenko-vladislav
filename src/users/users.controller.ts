import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Condition, District, Education } from '@prisma/client';
import express from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { MvcExceptionFilter } from '../filters/mvc-exception.filter';
import { NotificationService } from '../notification/notification.service';

@ApiExcludeController()
@Controller('users')
@UseFilters(MvcExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/create')
  @Render('users/create')
  showCreateForm(@GetUser() user: User) {
    return {
      title: 'Регистрация',
      username: user?.name,
    };
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: express.Response,
  ) {
    const user = await this.usersService.create(createUserDto);
    this.notificationService.created('user', user.name);
    return res.redirect(`users/${user.id}`);
  }

  @Get()
  @Render('users/index')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @GetUser() user: User,
  ) {
    const limit = 6;

    const result = await this.usersService.findAllPaginated(page, limit);

    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      users: result.users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      title: 'Все пользователи',
      username: user?.name,
    };
  }

  @Get(':id')
  @Render('users/id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const userObj = await this.usersService.findById(id);

    if (!userObj) {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      user: userObj,
      username: user?.name,
    };
  }

  @Get(':id/edit')
  @Render('users/edit')
  @UseGuards(AuthGuard)
  async showEditForm(@Param('id') id: string, @GetUser() user: User) {
    const userObj = await this.usersService.findById(id);

    if (!userObj) {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      user: userObj,
      title: `Редактировать: ${userObj.name}`,
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
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    await this.usersService.update(id, updateUserDto, user?.id, user?.role);
    this.notificationService.updated('user', user.name);
    return res.redirect(`/users/${id}`);
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @Res() res: express.Response,
    @GetUser() user: User,
  ) {
    await this.usersService.delete(id, user?.id, user?.role);
    this.notificationService.deleted('user', user.name);
    return res.redirect(`/users`);
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
      folder: `users/${id}/avatars`,
      generateUniqueKey: true,
    });

    await this.usersService.updateAvatar(id, result.url, user?.id, user?.role);
    this.notificationService.updated('user', `${user.name} photo`);
  }
}
