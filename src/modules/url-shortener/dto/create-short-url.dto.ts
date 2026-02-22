import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateShortUrlDto {
  @ApiProperty({
    description: 'The long URL to be shortened',
    example: 'https://www.example.com/very/long/url/path',
  })
  @IsUrl({}, { message: 'longUrl must be a valid URL' })
  longUrl: string;

  @ApiProperty({
    description: 'Optional expiration date for the short URL (ISO 8601 format)',
    example: '2026-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {
      strict: true,
      strictSeparator: true,
    },
    { message: 'expirationDate must be a valid ISO 8601 date string' },
  )
  expirationDate?: string;

  @ApiProperty({
    description: 'ID of the user creating the short URL',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'userId must be a valid UUID v4' })
  userId: string;
}
