import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query, UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiExceptionFilter } from '../filters/api-exception.filter';

@ApiTags('users')
@Controller('api/users')
@UseFilters(ApiExceptionFilter)
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserDto(
      user.id,
      user.name,
      user.email,
      user.createdAt,
      user.image,
    );
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    try {
      const limit = 6;

      const result = await this.usersService.findAllPaginated(page, limit);

      return result.users.map(
        (user) =>
          new UserDto(
            user.id,
            user.name,
            user.email,
            user.createdAt,
            user.image,
          ),
      );
    } catch (error) {
      console.error('Error while getting users:', error);
      return {
        error: 'Произошла ошибка при загрузке пользователей',
        title: 'Ошибка сервера',
        users: [],
        pagination: null,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      return {
        error: 'Пользователь не найден',
        title: 'Ошибка 404',
      };
    }

    return new UserDto(
      user.id,
      user.name,
      user.email,
      user.createdAt,
      user.image,
    );
  }

  @Post(':id/edit')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    const userObj = await this.usersService.update(id, updateUserDto, user?.id);
    return new UserDto(
      userObj.id,
      userObj.name,
      userObj.email,
      userObj.createdAt,
      userObj.image,
    );
  }

  @Post(':id/delete')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    const userObj = await this.usersService.delete(id, user?.id);
    return new UserDto(
      userObj.id,
      userObj.name,
      userObj.email,
      userObj.createdAt,
      userObj.image,
    );
  }
}
