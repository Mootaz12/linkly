import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UrlShortenerService } from './services/url-shortener.service';
import { CreateShortUrlDto, ShortUrlDto } from './dto';

@ApiTags('URL Shortener')
@Controller()
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post('shorten-url')
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

  @Get(':slug')
  @ApiOperation({ summary: 'Redirect to long URL' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirecting to long URL',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shortened URL not found',
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: 'Shortened URL has expired',
  })
  async redirectToLongUrl(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const requestUrl = `${req.protocol}://${req.hostname}`;
    const longUrl = await this.urlShortenerService.getLongUrl(slug, requestUrl);
    return res.redirect(HttpStatus.FOUND, longUrl);
  }
}
