import { BaseEntity } from '@base/entities/base.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UseDto } from '@app-decorators/use-dto.decorator';
import { ShortUrlDto } from '../dto';
import { UserEntity } from '@modules/users/entities/user.entity';

@Entity('shorten_url')
@UseDto(ShortUrlDto)
export class ShortenUrlEntity extends BaseEntity {
  @PrimaryColumn('text')
  shortUrl: string;

  @Column({ type: 'text' })
  longUrl: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: Date | null;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ type: 'int', default: 0 })
  visits: number;
}
