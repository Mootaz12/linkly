import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlGeneratorService } from './services/url-generator.service';
import { ShortenUrlEntity } from './entities/shorten-url.entity';
import { UrlShortenerService } from './services/url-shortener.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShortenUrlEntity])],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, UrlGeneratorService],
})
export class UrlShortenerModule {}
