import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { UsersModule } from '../users/users.module';
import { CompaniesApiController } from './companies.controller.api';
import { CompaniesResolver } from './companies.resolver';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [UsersModule, StorageModule],
  controllers: [CompaniesController, CompaniesApiController],
  providers: [CompaniesService, CompaniesResolver],
  exports: [CompaniesService],
})
export class CompaniesModule {}
