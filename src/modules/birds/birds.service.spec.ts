import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BirdsService } from './birds.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('BirdsService', () => {
  let service: BirdsService;
  let bird: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    bird = { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirdsService,
        { provide: PrismaService, useValue: { bird } },
      ],
    }).compile();

    service = module.get<BirdsService>(BirdsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('returns the bird when it exists', async () => {
      const found = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      bird.findUnique.mockResolvedValue(found);

      await expect(service.findOne('abc')).resolves.toEqual(found);
      expect(bird.findUnique).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });

    it('throws NotFoundException when the bird does not exist', async () => {
      bird.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('returns the updated bird', async () => {
      const updated = { id: 'abc', name: 'Beta', age: 3, breed: 'common' };
      bird.update.mockResolvedValue(updated);

      await expect(service.update('abc', { name: 'Beta' })).resolves.toEqual(
        updated,
      );
      expect(bird.update).toHaveBeenCalledWith({
        where: { id: 'abc' },
        data: { name: 'Beta' },
      });
    });
  });

  describe('remove', () => {
    it('returns the removed bird', async () => {
      const removed = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      bird.delete.mockResolvedValue(removed);

      await expect(service.remove('abc')).resolves.toEqual(removed);
      expect(bird.delete).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });
  });
});
