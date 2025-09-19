import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersApiController } from './users.controller.api';
import { UsersResolver } from './users.resolver';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [UsersController, UsersApiController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
