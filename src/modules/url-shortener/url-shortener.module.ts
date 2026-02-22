import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlGeneratorService } from './services/url-generator.service';
import { ShortenUrlEntity } from './entities/shorten-url.entity';
import { UrlShortenerService } from './services/url-shortener.service';
import { SHORTEN_URL_QUEUE } from '@const/queues';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortenUrlEntity]),
    BullModule.registerQueue({
      name: SHORTEN_URL_QUEUE,
    }),
    UsersModule,
  ],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, UrlGeneratorService],
})
export class UrlShortenerModule {}
