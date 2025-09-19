import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { ResumeApiController } from './resume.controller.api';
import { ResumeResolver } from './resume.resolver';

@Module({
  controllers: [ResumeController, ResumeApiController],
  providers: [ResumeService, ResumeResolver],
})
export class ResumeModule {}
