import { BaseDtoWithId } from '@/base/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends BaseDtoWithId {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email: string;

  constructor(entity: any) {
    super(entity);
    this.email = entity.email;
  }
}
