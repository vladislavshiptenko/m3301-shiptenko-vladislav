import { CreateCompanyDto } from './create-company.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
