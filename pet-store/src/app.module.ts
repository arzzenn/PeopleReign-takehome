/*
  Do not modify this file.
*/

import { Logger, MiddlewareConsumer, Module, ModuleMetadata, NestModule, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLoggerMiddleware } from './HttpLogger.middleware';
import { PetModule } from './pet/pet.module';

export const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
export const appModuleMetadata: ModuleMetadata = {
  imports: [
    PetModule,
    MongooseModule.forRoot(`mongodb://pet-store-app:pet-store-app-pw@${MONGO_HOST}:27017/pet-store?authSource=pet-store`),
  ],
  controllers: [],
  providers: [],
};

@Module(appModuleMetadata)
export class AppModule implements NestModule, OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit(): Promise<void> {
    this.logger.log(`MONGO_HOST = ${MONGO_HOST}`);
  }

  configure(consumer: MiddlewareConsumer) {
    // log HTTP requests
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
