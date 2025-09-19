import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
      hasPremium: false,
    };

    return this.database.user.create({ data: userWithHashedPassword });
  }

  async findById(id: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { email },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<User> {
    if (id != userId) {
      throw new UnauthorizedException();
    }

    return this.database.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateAvatar(id: string, url: string, userId: string): Promise<User> {
    if (id != userId) {
      throw new UnauthorizedException();
    }

    return this.database.user.update({
      where: { id },
      data: {
        image: url,
      },
    });
  }

  async delete(id: string, userId: string): Promise<User> {
    if (id != userId) {
      throw new UnauthorizedException();
    }

    return this.database.user.delete({
      where: { id },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.database.user.findMany({
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdAt: true,
        },
      }),

      this.database.user.count({}),
    ]);

    return {
      users,
      total,
    };
  }
}
