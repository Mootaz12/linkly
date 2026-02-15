import { BaseEntity } from '@base/entities/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UseDto } from '@app-decorators/use-dto.decorator';
import { ShortUrlDto } from '../dto';

@Entity('shorten_url')
@UseDto(ShortUrlDto)
export class ShortenUrlEntity extends BaseEntity {
  @PrimaryColumn('text')
  shortUrl: string;

  @Column({ type: 'text' })
  longUrl: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: Date | null;
}
