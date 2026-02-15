import { ApiProperty } from '@nestjs/swagger';

export class ShortUrlDto {
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
  expirationDate?: Date;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-02-15T16:00:00Z',
  })
  createdAt: Date;
}
