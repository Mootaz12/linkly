import { DTO_CLASS_KEY } from '@app-decorators/use-dto.decorator';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  toDto<T = any>(data?: any): T {
    const dtoClass = Reflect.getMetadata(DTO_CLASS_KEY, this.constructor);

    if (!dtoClass) {
      throw new Error(
        `Dto class not found for ${this.constructor.name}. Did you forget @UseDto?`,
      );
    }

    return new dtoClass(this, data);
  }
}

export abstract class BaseEntityWithID extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
