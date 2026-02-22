import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './services/url-shortener.service';
import { CreateShortUrlDto } from './dto';
import { HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

describe('UrlShortenerController', () => {
  let controller: UrlShortenerController;
  let service: jest.Mocked<UrlShortenerService>;

  beforeEach(async () => {
    service = {
      createShortUrl: jest.fn(),
      getLongUrl: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [
        {
          provide: UrlShortenerService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UrlShortenerController>(UrlShortenerController);
  });

  describe('createShortUrl', () => {
    it('should call service and return short url', async () => {
      const dto: CreateShortUrlDto = {
        longUrl: 'http://example.com',
        userId: 'user-id',
      };
      const req = { protocol: 'http', hostname: 'localhost' } as Request;
      const expectedResult = { shortUrl: 'http://localhost/slug1' };

      service.createShortUrl.mockResolvedValue(expectedResult as any);

      const result = await controller.createShortUrl(dto, req);

      expect(result).toEqual(expectedResult);
      expect(service.createShortUrl).toHaveBeenCalledWith(
        dto,
        'http://localhost',
      );
    });
  });

  describe('redirectToLongUrl', () => {
    it('should redirect to the long url', async () => {
      const slug = 'slug12';
      const req = { protocol: 'http', hostname: 'localhost' } as Request;
      const res = { redirect: jest.fn() } as unknown as Response;
      const longUrl = 'http://example.com/long';

      service.getLongUrl.mockResolvedValue(longUrl);

      await controller.redirectToLongUrl(slug, req, res);

      expect(service.getLongUrl).toHaveBeenCalledWith(slug, 'http://localhost');
      expect(res.redirect).toHaveBeenCalledWith(HttpStatus.FOUND, longUrl);
    });
  });
});
