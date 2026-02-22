import { BaseEntityWithID } from '@base/entities/base.entity';
import { Entity, Column } from 'typeorm';
import { UseDto } from '@app-decorators/use-dto.decorator';
import { UserDto } from '../dto';

@Entity('users')
@UseDto(UserDto)
export class UserEntity extends BaseEntityWithID {
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;
}
