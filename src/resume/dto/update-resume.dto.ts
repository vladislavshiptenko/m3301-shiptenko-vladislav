import { CreateResumeDto } from './create-resume.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResumeDto extends PartialType(CreateResumeDto) {}
