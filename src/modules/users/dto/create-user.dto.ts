import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(({ value }) => value?.trim())
  @IsEmail(
    {},
    {
      message: 'Invalid email address',
    },
  )
  email: string;

  @ApiProperty({ minLength: 8, example: 'password123' })
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;
}
