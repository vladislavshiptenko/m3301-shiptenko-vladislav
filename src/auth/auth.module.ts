import {
  Module,
  MiddlewareConsumer,
  NestModule,
  DynamicModule, RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { middleware } from 'supertokens-node/framework/express';

@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(middleware()).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [UsersModule],
      providers: [AuthService],
      controllers: [AuthController],
      exports: [AuthService],
    };
  }
}
