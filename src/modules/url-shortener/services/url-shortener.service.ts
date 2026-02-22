import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UrlGeneratorService } from './url-generator.service';
import { MAX_CREATING_SHORTEN_URL_ATTEMPTS } from '@const/shorten-url.const';
import { ShortenUrlEntity } from '@modules/url-shortener/entities/shorten-url.entity';
import { CreateShortUrlDto } from '../dto';
import {
  MaxCreatingShortenUrlAttemptsExceeded,
  ShortenUrlExpiredException,
  ShortenUrlNotFoundException,
} from '@errors/shorten-url.error';
import { UserEntity } from '@modules/users/entities/user.entity';
import { SHORTEN_URL_QUEUE, SHORTEN_URL_JOB } from '@const/queues';
import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectRepository(ShortenUrlEntity)
    private readonly shortenUrlRepository: Repository<ShortenUrlEntity>,
    private readonly urlGeneratorService: UrlGeneratorService,
    private readonly usersService: UsersService,
    @InjectQueue(SHORTEN_URL_QUEUE) private readonly urlVisitsQueue: Queue,
  ) {}

  async createShortUrl(
    createShortUrlDto: CreateShortUrlDto,
    requestUrl: string,
  ) {
    const { longUrl, expirationDate, userId } = createShortUrlDto;
    const user = (await this.usersService.findOneOrFail(
      userId,
      true,
    )) as UserEntity;
    let slug!: string;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < MAX_CREATING_SHORTEN_URL_ATTEMPTS) {
      slug = this.urlGeneratorService.generateSlug();
      const fullShortUrl = `${requestUrl}/${slug}`;
      const existing = await this.shortenUrlRepository.findOne({
        where: { shortUrl: fullShortUrl },
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
      user,
    });
    const saved = await this.shortenUrlRepository.save(shortenUrl);

    return saved.toDto();
  }

  async getLongUrl(slug: string, requestUrl: string): Promise<string> {
    const fullShortUrl = `${requestUrl}/${slug}`;
    const shortenUrl = await this.shortenUrlRepository.findOne({
      where: { shortUrl: fullShortUrl },
    });

    if (!shortenUrl) {
      throw new ShortenUrlNotFoundException();
    }
    const { expirationDate, longUrl, shortUrl } = shortenUrl;
    if (expirationDate && new Date() > expirationDate) {
      throw new ShortenUrlExpiredException();
    }

    await this.urlVisitsQueue.add(SHORTEN_URL_JOB, {
      shortUrl,
    });

    return longUrl;
  }

  async incrementVisits(shortUrl: string): Promise<void> {
    await this.shortenUrlRepository.increment({ shortUrl }, 'visits', 1);
  }
}
