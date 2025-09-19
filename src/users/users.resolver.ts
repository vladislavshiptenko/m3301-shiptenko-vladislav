import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersResponse } from './dto/users.response';
import { GraphQLAuthGuard } from '../guards/graphql-auth.guard';
import { GetUserGQL } from '../decorators/get-user-gql.decorator';
import { User } from '../auth/entities/user.entity';
import { GraphQLExceptionFilter } from '../filters/graphql-exception.filter';

@Resolver(() => UserDto)
@UseFilters(GraphQLExceptionFilter)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserDto, { description: 'Создание нового пользователя' })
  async createUser(@Args('createUserInput') createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserDto(
      user.id,
      user.name,
      user.email,
      user.createdAt,
      user.image,
    );
  }

  @Query(() => UsersResponse, {
    description: 'Получение списка пользователей с пагинацией',
  })
  async users(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
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

  @Query(() => UserDto, { description: 'Получение пользователя по ID' })
  async user(@Args('id', { type: () => ID }) id: string) {
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

  @Mutation(() => UserDto, { description: 'Обновление пользователя' })
  @UseGuards(GraphQLAuthGuard)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
    @GetUserGQL() user: User,
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

  @Mutation(() => UserDto, { description: 'Удаление пользователя' })
  @UseGuards(GraphQLAuthGuard)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
    @GetUserGQL() user: User,
  ) {
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
