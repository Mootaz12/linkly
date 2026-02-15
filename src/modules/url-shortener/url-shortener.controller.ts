import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UrlShortenerService } from './services/url-shortener.service';
import { CreateShortUrlDto, ShortUrlDto } from './dto';

@ApiTags('URL Shortener')
@Controller('shorten-url')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a shortened URL' })
  @ApiBody({ type: CreateShortUrlDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The URL has been successfully shortened.',
    type: ShortUrlDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed or max attempts exceeded.',
  })
  async createShortUrl(
    @Body() createShortUrlDto: CreateShortUrlDto,
    @Req() req: Request,
  ) {
    const requestUrl = `${req.protocol}://${req.hostname}`;
    return this.urlShortenerService.createShortUrl(
      createShortUrlDto,
      requestUrl,
    );
  }
}
