import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto, UserDto } from '../dto';
import {
  MissingUserEmailException,
  MissingUserPasswordException,
  UserEmailAlreadyExistsException,
  UserNotFoundException,
} from '@errors/user.error';
import { validateField } from '@utils/fields-validations';
import { PASSWORD_HASH_SALT } from '@const/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, password } = createUserDto;
    validateField({ email }, 'email', new MissingUserEmailException());
    validateField({ password }, 'password', new MissingUserPasswordException());

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new UserEmailAlreadyExistsException();
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.save(user);
    return createdUser.toDto();
  }

  async findUsers(): Promise<UserDto[]> {
    return (await this.userRepository.find()).map((user) => user.toDto());
  }

  async findOneOrFail(
    id: string,
    asEntity = false,
  ): Promise<UserDto | UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return asEntity ? user : user.toDto();
  }

  async findByEmail(
    email: string,
    excludedId?: string,
  ): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({
      where: { email, id: excludedId ? Not(excludedId) : undefined },
    });
    return user?.toDto() || null;
  }
}
