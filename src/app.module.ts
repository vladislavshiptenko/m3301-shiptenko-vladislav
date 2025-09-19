import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { ResumeModule } from './resume/resume.module';
import { CompaniesModule } from './companies/companies.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    AuthModule.forRoot(),
    NotificationModule,
    UsersModule,
    ArticlesModule,
    ResumeModule,
    CompaniesModule,
    VacanciesModule,
    AuthModule,
    StorageModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
