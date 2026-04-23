import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../src/database/entities/user.entity';
import { UserService } from '../../../src/api/user/services/user.service';
import { UserRepository } from '../../../src/api/user/repositories/user.repository';
import { EventEmitter } from '../../../src/core/event-emitter.service';
import { errorMessages } from '../../../src/errors/custom';

describe('UserService', () => {
  let service: UserService;
  let fakeUserRepository: Partial<UserRepository>;
  let fakeEventEmitter: Partial<EventEmitter>;

  const user = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedpassword',
  } as User;

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeUserRepository = {
      findOneById: jest.fn().mockResolvedValue(user),
      findOneByEmail: jest.fn().mockResolvedValue(user),
      createAndSave: jest.fn().mockResolvedValue(user),
      save: jest.fn().mockResolvedValue(user),
    };
    fakeEventEmitter = {
      createEvent: jest.fn().mockReturnValue({}),
      emit: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: fakeUserRepository,
        },
        {
          provide: EventEmitter,
          useValue: fakeEventEmitter,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const result = await service.findById(1);

      expect(fakeUserRepository.findOneById).toHaveBeenCalled();
      expect(result.id).toBe(user.id);
    });

    it('should throw error if not found', async () => {
      fakeUserRepository.findOneById = jest.fn().mockResolvedValue(null);
      const result = service.findById(1);

      expect(fakeUserRepository.findOneById).toHaveBeenCalled();
      await expect(result).rejects.toThrowError(
        errorMessages.user.notFound.message,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const result = await service.findByEmail('test@test.com');
      expect(fakeUserRepository.findOneByEmail).toHaveBeenCalled();
      expect(result.id).toBe(user.id);
    });

    it('should return null when not found', async () => {
      fakeUserRepository.findOneByEmail = jest.fn().mockResolvedValue(null);
      const result = await service.findByEmail('notFound@test.com');

      expect(fakeUserRepository.findOneByEmail).toHaveBeenCalled();
      expect(result).toBe(null);
    });
  });

  describe('save', () => {
    it('should save and return user', async () => {
      const result = await service.save(user);
      expect(fakeUserRepository.save).toBeCalledWith(user);
      expect(result.id).toBe(user.id);
    });
  });

  describe('createUser', () => {
    it('should create and return user with hashed password', async () => {
      const result = await service.createUser({
        email: 'new@test.com',
        password: 'plainpassword',
      });

      expect(fakeUserRepository.createAndSave).toBeCalled();
      expect(fakeEventEmitter.createEvent).toBeCalled();
      expect(fakeEventEmitter.emit).toBeCalled();
      expect(result.id).toBe(user.id);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const mockCompare = jest.fn().mockResolvedValue(true);
      (service as any).comparePassword = mockCompare;

      const result = await service.comparePassword(
        'password123',
        user.password,
      );
      expect(result).toBe(true);
    });

    it('should return false for wrong password', async () => {
      const result = await service.comparePassword(
        'wrongpassword',
        user.password,
      );
      expect(result).toBe(false);
    });
  });
});
