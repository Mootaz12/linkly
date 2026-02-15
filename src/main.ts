import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable global validation with 422 status code for validation errors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // Use 422 for validation errors
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Linkly - URL Shortener API')
    .setDescription(
      'A highly available URL shortener service that converts long URLs into short, unique slugs using a random-based base62 algorithm. ' +
        'The system prioritizes availability and partition tolerance, avoiding centralized counters.',
    )
    .setVersion('1.0')
    .addTag('URL Shortener', 'Endpoints for creating and resolving short URLs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
void bootstrap();
