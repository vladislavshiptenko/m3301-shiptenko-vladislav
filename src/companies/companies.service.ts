import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DatabaseService } from '../database/database.service';
import { Company, Role } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private database: DatabaseService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId: string,
  ): Promise<Company> {
    return this.database.company.create({
      data: {
        ...createCompanyDto,
        ownerId: userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findById(id: string): Promise<Company | null> {
    return this.database.company.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
    role: string,
  ): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    if (company.ownerId != userId && role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.company.update({
      where: { id },
      include: { user: true },
      data: updateCompanyDto,
    });
  }

  async delete(id: string, userId: string, role: string): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    if (company.ownerId != userId && role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.company.delete({
      where: { id },
      include: { user: true },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      this.database.company.findMany({
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          user: true,
          image: true,
          createdAt: true,
        },
      }),

      this.database.company.count({}),
    ]);

    return {
      companies,
      total,
    };
  }

  async updateAvatar(
    id: string,
    url: string,
    userId: string,
    role: string,
  ): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    if (company.ownerId != userId && role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.company.update({
      where: { id },
      data: {
        image: url,
      },
    });
  }

  findByName(name: string | undefined) {
    return this.database.company.findUnique({
      where: { name },
    });
  }
}
