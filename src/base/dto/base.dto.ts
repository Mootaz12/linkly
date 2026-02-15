import { BaseEntity, BaseEntityWithID } from '../entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseDto {
  @ApiProperty({
    description: 'The date and time when the entity was created',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the entity was last updated',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(entity: BaseEntity) {
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
export abstract class BaseDtoWithId extends BaseDto {
  @ApiProperty({
    description: 'The unique identifier of the entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  constructor(entity: BaseEntityWithID) {
    super(entity);
    this.id = entity.id;
  }
}
