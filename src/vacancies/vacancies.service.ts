import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Role, Vacancy } from '@prisma/client';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { GetVacancyDto } from './dto/get-vacancy.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class VacanciesService {
  constructor(
    private database: DatabaseService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    createVacancyDto: CreateVacancyDto,
    userId: string,
    role: string,
  ): Promise<Vacancy> {
    const company = await this.companiesService.findByName(
      createVacancyDto.companyName,
    );

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    if (company.ownerId !== userId && role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.vacancy.create({
      data: {
        title: createVacancyDto.title,
        description: createVacancyDto.description,
        minPrice: createVacancyDto.minPrice,
        maxPrice: createVacancyDto.maxPrice,
        phoneNumber: createVacancyDto.phoneNumber,
        education: createVacancyDto.education,
        condition: createVacancyDto.condition,
        companyId: company.id,
      },
      include: {
        company: true,
      },
    });
  }

  async findById(id: string): Promise<Vacancy | null> {
    return this.database.vacancy.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  async update(
    id: string,
    updateVacancyDto: UpdateVacancyDto,
    userId: string,
    role: string,
  ): Promise<Vacancy> {
    const vacancy = await this.findById(id);
    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    const company = await this.companiesService.findById(vacancy.companyId);

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    if (company.ownerId !== userId && role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.vacancy.update({
      where: { id },
      include: { company: true },
      data: {
        title: updateVacancyDto.title,
        description: updateVacancyDto.description,
        minPrice: updateVacancyDto.minPrice,
        maxPrice: updateVacancyDto.maxPrice,
        phoneNumber: updateVacancyDto.phoneNumber,
        education: updateVacancyDto.education,
        condition: updateVacancyDto.condition,
        companyId: company.id,
      },
    });
  }

  async delete(id: string, userId: string, role: string): Promise<Vacancy> {
    const vacancy = await this.findById(id);
    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    const company = await this.companiesService.findById(vacancy.companyId);

    if (!company) {
      throw new NotFoundException('Компания не найдена');
    }

    if (company.ownerId !== userId && role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.vacancy.delete({
      where: { id },
      include: { company: true },
    });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    getVacancyDto?: GetVacancyDto,
  ) {
    const skip = (page - 1) * limit;

    const [vacancies, total] = await Promise.all([
      this.database.vacancy.findMany({
        orderBy: [
          { createdAt: 'desc' },
          { company: { user: { hasPremium: 'desc' } } },
        ],
        where: {
          district: getVacancyDto?.district,
          education: getVacancyDto?.education,
          condition: getVacancyDto?.condition,
          title: {
            contains: getVacancyDto?.title,
          },
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          minPrice: true,
          maxPrice: true,
          phoneNumber: true,
          district: true,
          education: true,
          condition: true,
          company: {
            select: {
              name: true,
              user: true,
            },
          },
          createdAt: true,
        },
      }),

      this.database.vacancy.count({
        where: {
          district: getVacancyDto?.district,
          education: getVacancyDto?.education,
          condition: getVacancyDto?.condition,
          title: {
            contains: getVacancyDto?.title,
          },
        },
      }),
    ]);

    const hot_vacancies = vacancies.filter((v) => v.company.user.hasPremium);

    const latest_vacancies = vacancies.filter(
      (v) => !v.company.user.hasPremium,
    );

    return {
      hot_vacancies,
      latest_vacancies,
      total,
    };
  }
}
