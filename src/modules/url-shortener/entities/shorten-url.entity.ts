import { BaseEntity } from '@base/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('shorten_url')
export class ShortenUrlEntity extends BaseEntity {
  @PrimaryColumn('text')
  shortUrl: string;

  @Column({ type: 'text' })
  longUrl: string;

  @Column({ type: 'time with time zone', nullable: true })
  expirationDate: Date | null;
}
