import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';

import { AppConfigService } from '@app/config';
import { TypeOrmExceptionFilter } from '@app/filters';
import { ResponseInterceptor } from '@app/interceptors';

import { AppModule } from './app';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);
  const config = app.get(AppConfigService);

  const globalPrefix = 'api';
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new TypeOrmExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidUnknownValues: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin:
      config.env === 'prod'
        ? 'https://soundsphere.vercel.app'
        : 'http://localhost:3001',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SoundSphere API')
    .setDescription('API for SoundSphere music shop')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  await app.listen(config.port, config.host);
  logger.log(`Server's running at http://${config.host}:${config.port}`);
}
bootstrap();
