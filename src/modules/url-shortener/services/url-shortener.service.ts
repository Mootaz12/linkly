import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlGeneratorService } from './url-generator.service';
import { MAX_CREATING_SHORTEN_URL_ATTEMPTS } from '@const/shorten-url.const';
import { ShortenUrlEntity } from '@modules/url-shortener/entities/shorten-url.entity';
import { CreateShortUrlDto } from '../dto';
import { MaxCreatingShortenUrlAttemptsExceeded } from '@errors/shorten-url.error';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectRepository(ShortenUrlEntity)
    private readonly shortenUrlRepository: Repository<ShortenUrlEntity>,
    private readonly urlGeneratorService: UrlGeneratorService,
  ) {}

  async createShortUrl(
    createShortUrlDto: CreateShortUrlDto,
    requestUrl: string,
  ) {
    const { longUrl, expirationDate } = createShortUrlDto;

    let slug!: string;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < MAX_CREATING_SHORTEN_URL_ATTEMPTS) {
      slug = this.urlGeneratorService.generateSlug();
      const existing = await this.shortenUrlRepository.findOne({
        where: { shortUrl: slug },
      });

      isUnique = !existing;
      attempts++;
    }

    if (!isUnique) {
      throw new MaxCreatingShortenUrlAttemptsExceeded();
    }
    const shortenUrl = this.shortenUrlRepository.create({
      shortUrl: requestUrl + '/' + slug,
      longUrl,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
    });
    const saved = await this.shortenUrlRepository.save(shortenUrl);

    return saved.toDto();
  }
}
