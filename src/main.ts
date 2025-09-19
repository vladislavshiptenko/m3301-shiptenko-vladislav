import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { create } from 'express-handlebars';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressPlayground from 'graphql-playground-middleware-express';
import { registerEnumType } from '@nestjs/graphql';
import { Condition, District, Education } from '@prisma/client';
import { TimingInterceptor } from './interceptors/timing.interceptor';
import './config/supertokens.config';
import supertokens from 'supertokens-node';
import { OptionalAuthGuard } from './guards/optional-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:5000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  const hbs = create({
    extname: '.hbs',
    defaultLayout: 'index',
    partialsDir: [join(__dirname, '..', 'views/partials')],
  });
  app.engine('hbs', hbs.engine);
  app.setViewEngine('hbs');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  app.use(
    '/playground',
    expressPlayground.default({
      endpoint: '/graphql',
      settings: {
        'request.credentials': 'include',
      },
    }),
  );

  registerEnumType(District, {
    name: 'District',
    description: 'Available districts',
  });
  registerEnumType(Condition, {
    name: 'Condition',
    description: 'Available districts',
  });
  registerEnumType(Education, {
    name: 'Education',
    description: 'Available districts',
  });

  app.useGlobalInterceptors(new TimingInterceptor());
  app.useGlobalGuards(new OptionalAuthGuard());

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Описание API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api/hello`);
  console.log(`Static files available at: http://localhost:${port}`);
}

bootstrap();
