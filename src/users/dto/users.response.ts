import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class UsersResponse {
  constructor(users: UserDto[], total: number) {
    this.users = users;
    this.total = total;
  }

  @ApiProperty({
    description: 'users',
    example: '[{ id: "id", "name": "name" }]',
  })
  @IsNotEmpty()
  @Field(() => [UserDto])
  users: UserDto[];

  @ApiProperty({
    description: 'total',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Field()
  total: number;
}
