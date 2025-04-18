/*
  Do not modify this file.
*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port: number = process.env.PORT !== undefined ? <number>parseInt(process.env.PORT, 10) : 3330;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
