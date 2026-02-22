import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { UrlGeneratorService } from './url-generator.service';
import { UsersService } from '@modules/users/services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShortenUrlEntity } from '../entities/shorten-url.entity';
import { getQueueToken } from '@nestjs/bullmq';
import { SHORTEN_URL_QUEUE, SHORTEN_URL_JOB } from '@const/queues';
import {
  MaxCreatingShortenUrlAttemptsExceeded,
  ShortenUrlExpiredException,
  ShortenUrlNotFoundException,
} from '@errors/shorten-url.error';

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let urlGeneratorService: jest.Mocked<UrlGeneratorService>;
  let usersService: jest.Mocked<UsersService>;
  let shortenUrlRepository: any;
  let urlVisitsQueue: any;

  beforeEach(async () => {
    urlGeneratorService = {
      generateSlug: jest.fn(),
    } as any;

    usersService = {
      findOneOrFail: jest.fn(),
    } as any;

    shortenUrlRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      increment: jest.fn(),
    };

    urlVisitsQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        {
          provide: UrlGeneratorService,
          useValue: urlGeneratorService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: getRepositoryToken(ShortenUrlEntity),
          useValue: shortenUrlRepository,
        },
        {
          provide: getQueueToken(SHORTEN_URL_QUEUE),
          useValue: urlVisitsQueue,
        },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  describe('createShortUrl', () => {
    it('should successfully create a short URL', async () => {
      const createDto = { longUrl: 'https://example.com', userId: 'user-id' };
      const requestUrl = 'http://localhost';

      usersService.findOneOrFail.mockResolvedValue({ id: 'user-id' } as any);
      urlGeneratorService.generateSlug.mockReturnValue('slug12');
      shortenUrlRepository.findOne.mockResolvedValue(null);

      const mockEntity = {
        toDto: () => ({ shortUrl: 'http://localhost/slug12' }),
      };
      shortenUrlRepository.create.mockReturnValue(mockEntity);
      shortenUrlRepository.save.mockResolvedValue(mockEntity);

      const result = await service.createShortUrl(createDto, requestUrl);

      expect(result).toEqual({ shortUrl: 'http://localhost/slug12' });
      expect(urlGeneratorService.generateSlug).toHaveBeenCalled();
      expect(shortenUrlRepository.save).toHaveBeenCalled();
    });

    it('should throw MaxCreatingShortenUrlAttemptsExceeded if all attempts fail', async () => {
      const createDto = { longUrl: 'https://example.com', userId: 'user-id' };
      const requestUrl = 'http://localhost';

      usersService.findOneOrFail.mockResolvedValue({ id: 'user-id' } as any);
      urlGeneratorService.generateSlug.mockReturnValue('slug12');
      shortenUrlRepository.findOne.mockResolvedValue({}); // Always found

      await expect(
        service.createShortUrl(createDto, requestUrl),
      ).rejects.toThrow(new MaxCreatingShortenUrlAttemptsExceeded().message);
    });
  });

  describe('getLongUrl', () => {
    it('should return longUrl and queue a visit job', async () => {
      shortenUrlRepository.findOne.mockResolvedValue({
        longUrl: 'https://example.com',
        shortUrl: 'http://localhost/slug12',
        expirationDate: null,
      });

      const result = await service.getLongUrl('slug12', 'http://localhost');

      expect(result).toBe('https://example.com');
      expect(urlVisitsQueue.add).toHaveBeenCalledWith(SHORTEN_URL_JOB, {
        shortUrl: 'http://localhost/slug12',
      });
    });

    it('should throw ShortenUrlNotFoundException if not found', async () => {
      shortenUrlRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getLongUrl('nonexistent', 'http://127.0.0.1'),
      ).rejects.toThrow(new ShortenUrlNotFoundException().message);
    });

    it('should throw ShortenUrlExpiredException if expired', async () => {
      shortenUrlRepository.findOne.mockResolvedValue({
        expirationDate: new Date('2000-01-01'), // Past date
      });

      await expect(
        service.getLongUrl('expired', 'http://127.0.0.1'),
      ).rejects.toThrow(new ShortenUrlExpiredException().message);
    });
  });

  describe('incrementVisits', () => {
    it('should increment visits in repo', async () => {
      await service.incrementVisits('some-url');
      expect(shortenUrlRepository.increment).toHaveBeenCalledWith(
        { shortUrl: 'some-url' },
        'visits',
        1,
      );
    });
  });
});
