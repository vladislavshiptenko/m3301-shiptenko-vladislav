import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { UserDto } from './user.dto';

@ObjectType()
export class UsersResponse {
  constructor(users: UserDto[], total: number) {
    this.users = users;
    this.total = total;
  }

  @IsNotEmpty()
  @Field(() => [UserDto])
  users: UserDto[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
