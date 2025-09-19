import { CreateVacancyDto } from './create-vacancy.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {}
