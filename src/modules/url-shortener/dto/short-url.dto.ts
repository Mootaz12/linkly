import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@/base/dto/base.dto';
import { ShortenUrlEntity } from '../entities/shorten-url.entity';

export class ShortUrlDto extends BaseDto {
  @ApiProperty({
    description: 'The generated short URL',
    example: 'http://localhost:3000/aB3xY9',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'The original long URL',
    example: 'https://www.example.com/very/long/url/path',
  })
  longUrl: string;

  @ApiProperty({
    description: 'Expiration date of the short URL',
    example: '2026-12-31T23:59:59Z',
    required: false,
  })
  expirationDate: Date | null;

  constructor(entity: ShortenUrlEntity) {
    super(entity);
    this.shortUrl = entity.shortUrl;
    this.longUrl = entity.longUrl;
    this.expirationDate = entity.expirationDate;
  }
}
