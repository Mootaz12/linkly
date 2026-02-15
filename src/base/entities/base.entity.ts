import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;
}

export class BaseEntityWithID extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
