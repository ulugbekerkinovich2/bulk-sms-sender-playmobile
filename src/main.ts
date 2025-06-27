import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: '*', // Hamma kelib chiqishlarga ruxsat
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Ruxsat etilgan HTTP metodlar
    allowedHeaders: 'Content-Type, Authorization', // Ruxsat etilgan headerlar
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // Qolsa, DTO’dan tashqari fieldlarga error beradi
    }),
  );

  
  const config = new DocumentBuilder()
    .setTitle('Bulk SMS Sender')
    .setDescription('Send sms to many users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT || 3000);
  
}
bootstrap();
