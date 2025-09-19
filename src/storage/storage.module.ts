import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import s3Config from '../config/s3.config';

@Module({
  imports: [ConfigModule.forFeature(s3Config)],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
