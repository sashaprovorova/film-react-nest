import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';

import { FilmSchema } from './films/schemas/film.schema';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

import { configProvider } from './app.config.provider';

import { FilmsRepository } from './repository/films.repository';
import { MongoFilmsRepository } from './repository/films.repository.mongo';
import { PostgresFilmsRepository } from './repository/films.repository.postgres';

const dbDriver = process.env.DATABASE_DRIVER ?? 'postgres';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    // MongoDB
    ...(dbDriver === 'mongodb'
      ? [
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              uri:
                configService.get<string>('DATABASE_URL') ??
                'mongodb://localhost:27017/film',
            }),
            inject: [ConfigService],
          }),
          MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
        ]
      : []),

    // PostgreSQL
    ...(dbDriver === 'postgres'
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              url: config.get<string>('DATABASE_URL'),
              entities: [Film, Schedule],
              synchronize: false,
            }),
          }),
          TypeOrmModule.forFeature([Film, Schedule]),
        ]
      : []),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    {
      provide: FilmsRepository,
      useClass:
        dbDriver === 'postgres'
          ? PostgresFilmsRepository
          : MongoFilmsRepository,
    },
  ],
})
export class AppModule {}
