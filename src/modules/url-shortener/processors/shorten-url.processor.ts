import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SHORTEN_URL_QUEUE, SHORTEN_URL_JOB } from '@const/queues';
import { Logger } from '@nestjs/common';
import { UrlShortenerService } from '../services/url-shortener.service';

@Processor(SHORTEN_URL_QUEUE)
export class ShortenUrlProcessor extends WorkerHost {
  private readonly logger = new Logger(ShortenUrlProcessor.name);

  constructor(private readonly urlShortenerService: UrlShortenerService) {
    super();
  }

  async process(job: Job<{ shortUrl: string }, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case SHORTEN_URL_JOB: {
        const { shortUrl } = job.data;
        try {
          await this.urlShortenerService.incrementVisits(shortUrl);
          this.logger.log(`Successfully incremented visits for ${shortUrl}`);
        } catch (error) {
          this.logger.error(
            `Failed to increment visits for ${shortUrl}:`,
            error.stack,
          );
          throw error;
        }
        break;
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
