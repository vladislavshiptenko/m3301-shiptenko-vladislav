import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ApiExceptionFilter } from '../filters/api-exception.filter';
import { UsersResponse } from './dto/users.response';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('users')
@Controller('api/users')
@UseFilters(ApiExceptionFilter)
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Пользователь создан',
    type: UserDto,
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
  @ApiResponse({
    status: 200,
    description: 'Пользователи найдены',
    type: UsersResponse,
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
  ) {
    const limit = 6;

    const result = await this.usersService.findAllPaginated(page, limit);

    return new UsersResponse(
      result.users.map(
        (user) =>
          new UserDto(
            user.id,
            user.name,
            user.email,
            user.createdAt,
            user.image,
          ),
      ),
      result.total,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Пользователь найден',
    type: UserDto,
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
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
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
  @ApiResponse({
    status: 200,
    description: 'Пользователь обновлен',
    type: UserDto,
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
  @ApiResponse({
    status: 200,
    description: 'Пользователь удален',
    type: UserDto,
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
