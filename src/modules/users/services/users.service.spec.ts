import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  MissingUserEmailException,
  MissingUserPasswordException,
  UserEmailAlreadyExistsException,
  UserNotFoundException,
} from '@errors/user.error';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should successfully create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUserEntity = {
        toDto: () => ({ id: '1', email: 'test@example.com' }),
      };

      userRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      userRepository.create.mockReturnValue(mockUserEntity);
      userRepository.save.mockResolvedValue(mockUserEntity);

      const result = await service.create(createUserDto);
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith(
        'password123',
        expect.any(Number),
      );
    });

    it('should throw UserEmailAlreadyExistsException if email is taken', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.findOne.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        toDto: () => ({ id: '1', email: 'test@example.com' }),
      }); // Not null = exists

      await expect(service.create(createUserDto)).rejects.toThrow(
        new UserEmailAlreadyExistsException().message,
      );
    });

    it('should throw MissingUserEmailException if email is omitted', async () => {
      const createUserDto = { email: '', password: 'password123' };
      await expect(service.create(createUserDto)).rejects.toThrow(
        new MissingUserEmailException().message,
      );
    });

    it('should throw MissingUserPasswordException if password is omitted', async () => {
      const createUserDto = { email: 'test@example.com', password: '' };
      await expect(service.create(createUserDto)).rejects.toThrow(
        new MissingUserPasswordException().message,
      );
    });
  });

  describe('findUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { toDto: () => ({ id: '1', email: 'test@example.com' }) },
        { toDto: () => ({ id: '2', email: 'test2@example.com' }) },
      ];
      userRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findUsers();
      expect(result.length).toBe(2);
      expect(result[0].email).toBe('test@example.com');
    });
  });

  describe('findOneOrFail', () => {
    it('should return a user DTO', async () => {
      userRepository.findOne.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        toDto: () => ({ id: '1', email: 'test@example.com' }),
      });

      const result = await service.findOneOrFail('1');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should return a user Entity when asEntity is true', async () => {
      const mockEntity = {
        id: '1',
        email: 'test@example.com',
        toDto: () => ({ id: '1', email: 'test@example.com' }),
      };

      userRepository.findOne.mockResolvedValue(mockEntity);

      const result = await service.findOneOrFail('1', true);
      expect(result).toEqual(mockEntity);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneOrFail('non-existent-id')).rejects.toThrow(
        new UserNotFoundException().message,
      );
    });
  });
});
