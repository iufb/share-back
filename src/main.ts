import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ credentials: true, origin: 'http://localhost:5173' });
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Share-Minds')
    .setDescription('The Share-Minds API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
