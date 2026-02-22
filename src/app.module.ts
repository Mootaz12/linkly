import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { UrlShortenerModule } from '@modules/url-shortener/url-shortener.module';
import { UsersModule } from '@modules/users/users.module';
import { dataSourceOptions } from './database/data-source';
import { RedisConfig, redisConnectionConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConnectionConfig],
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.getOrThrow<RedisConfig>('redis');
        return {
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
        };
      },
      inject: [ConfigService],
    }),
    UrlShortenerModule,
    UsersModule,
  ],
})
export class AppModule {}
