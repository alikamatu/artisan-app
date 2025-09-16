import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials'
    ],
  });

    if (process.env.NODE_ENV === 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  await app.listen(process.env.PORT ?? 1000);
}
bootstrap();