import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { DatabaseService } from '../database/database.service';
import { GetResumeDto } from './dto/get-resume.dto';
import { Resume, Role } from '@prisma/client';

@Injectable()
export class ResumeService {
  constructor(private database: DatabaseService) {}

  create(createResumeDto: CreateResumeDto, userId: string) {
    return this.database.resume.create({
      data: {
        ...createResumeDto,
        userId,
      },
    });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    getResumeDto: GetResumeDto,
  ) {
    const skip = (page - 1) * limit;

    const [resume, total] = await Promise.all([
      this.database.resume.findMany({
        orderBy: [{ createdAt: 'desc' }, { user: { hasPremium: 'desc' } }],
        where: {
          district: getResumeDto.district,
          education: getResumeDto.education,
          condition: getResumeDto.condition,
          title: {
            contains: getResumeDto.title,
          },
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          user: true,
          createdAt: true,
          minPrice: true,
          maxPrice: true,
          phoneNumber: true,
          district: true,
          education: true,
          condition: true,
        },
      }),

      this.database.resume.count({
        where: {
          district: getResumeDto.district,
          education: getResumeDto.education,
          condition: getResumeDto.condition,
          title: {
            contains: getResumeDto.title,
          },
        },
      }),
    ]);

    const resume_list_priorities = resume.filter((r) => r.user.hasPremium);

    const resume_list = resume.filter((r) => !r.user.hasPremium);

    return {
      resume_list_priorities,
      resume_list,
      total,
    };
  }

  async findById(id: string): Promise<Resume | null> {
    return this.database.resume.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async update(
    id: string,
    updateResumeDto: UpdateResumeDto,
    userId: string,
    role: string,
  ) {
    const resume = await this.findById(id);
    if (!resume) {
      throw new NotFoundException('Резюме не найдено');
    }

    if (resume.userId != userId || role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.resume.update({
      where: { id },
      data: updateResumeDto,
    });
  }

  async remove(id: string, userId: string, role: string) {
    const resume = await this.findById(id);
    if (!resume) {
      throw new NotFoundException('Резюме не найдено');
    }

    if (resume.userId != userId || role != Role.Admin) {
      throw new UnauthorizedException();
    }

    return this.database.resume.delete({ where: { id } });
  }
}
