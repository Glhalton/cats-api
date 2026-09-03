import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DogsService } from './dogs.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('DogsService', () => {
  let service: DogsService;
  let dog: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    dog = { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DogsService,
        { provide: PrismaService, useValue: { dog } },
      ],
    }).compile();

    service = module.get<DogsService>(DogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('returns the dog when it exists', async () => {
      const found = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      dog.findUnique.mockResolvedValue(found);

      await expect(service.findOne('abc')).resolves.toEqual(found);
      expect(dog.findUnique).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });

    it('throws NotFoundException when the dog does not exist', async () => {
      dog.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('returns the updated dog', async () => {
      const updated = { id: 'abc', name: 'Beta', age: 3, breed: 'common' };
      dog.update.mockResolvedValue(updated);

      await expect(service.update('abc', { name: 'Beta' })).resolves.toEqual(
        updated,
      );
      expect(dog.update).toHaveBeenCalledWith({
        where: { id: 'abc' },
        data: { name: 'Beta' },
      });
    });
  });

  describe('remove', () => {
    it('returns the removed dog', async () => {
      const removed = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      dog.delete.mockResolvedValue(removed);

      await expect(service.remove('abc')).resolves.toEqual(removed);
      expect(dog.delete).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });
  });
});
