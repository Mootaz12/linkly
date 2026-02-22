import { Test, TestingModule } from '@nestjs/testing';
import { UrlGeneratorService } from './url-generator.service';

describe('UrlGeneratorService', () => {
  let service: UrlGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlGeneratorService],
    }).compile();

    service = module.get<UrlGeneratorService>(UrlGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSlug', () => {
    it('should generate a 6-character string', () => {
      const slug = service.generateSlug();
      expect(typeof slug).toBe('string');
      expect(slug.length).toBe(6);
    });

    it('should generate unique strings over multiple calls', () => {
      const slugs = new Set();
      for (let i = 0; i < 1000; i++) {
        slugs.add(service.generateSlug());
      }
      expect(slugs.size).toBe(1000); // Very low probability of collision in 1000 iterations
    });

    it('should only contain base62 characters', () => {
      const slug = service.generateSlug();
      expect(slug).toMatch(/^[0-9A-Za-z]{6}$/);
    });
  });
});
