import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findUsers: jest.fn(),
      findOneOrFail: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const resultDto = { id: '1', email: 'test@example.com' };

      service.create.mockResolvedValue(resultDto as any);

      const result = await controller.create(dto);

      expect(result).toEqual(resultDto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findUsers', () => {
    it('should return array of users', async () => {
      const resultDto = [{ id: '1', email: 'test@example.com' }];

      service.findUsers.mockResolvedValue(resultDto as any);

      const result = await controller.findUsers();

      expect(result).toEqual(resultDto);
      expect(service.findUsers).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const resultDto = { id: '1', email: 'test@example.com' };

      service.findOneOrFail.mockResolvedValue(resultDto as any);

      const result = await controller.findOne('1');

      expect(result).toEqual(resultDto);
      expect(service.findOneOrFail).toHaveBeenCalledWith('1');
    });
  });
});
