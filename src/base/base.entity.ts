import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;
}
@Entity()
export class BaseEntityWithID extends BaseEntity {
  @PrimaryColumn()
  id: string;
}
