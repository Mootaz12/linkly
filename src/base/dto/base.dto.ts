import { BaseEntity, BaseEntityWithID } from '../entities/base.entity';

export class BaseDto {
  createdAt: Date;
  updatedAt: Date;
  constructor(entity: BaseEntity) {
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
export class BaseDtoWithId extends BaseDto {
  id: string;
  constructor(entity: BaseEntityWithID) {
    super(entity);
    this.id = entity.id;
  }
}
