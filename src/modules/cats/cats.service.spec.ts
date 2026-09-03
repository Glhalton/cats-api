import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CatsService } from './cats.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('CatsService', () => {
  let service: CatsService;
  let cat: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    cat = { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        { provide: PrismaService, useValue: { cat } },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('returns the cat when it exists', async () => {
      const found = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      cat.findUnique.mockResolvedValue(found);

      await expect(service.findOne('abc')).resolves.toEqual(found);
      expect(cat.findUnique).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });

    it('throws NotFoundException when the cat does not exist', async () => {
      cat.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('returns the updated cat', async () => {
      const updated = { id: 'abc', name: 'Beta', age: 3, breed: 'common' };
      cat.update.mockResolvedValue(updated);

      await expect(service.update('abc', { name: 'Beta' })).resolves.toEqual(
        updated,
      );
      expect(cat.update).toHaveBeenCalledWith({
        where: { id: 'abc' },
        data: { name: 'Beta' },
      });
    });
  });

  describe('remove', () => {
    it('returns the removed cat', async () => {
      const removed = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      cat.delete.mockResolvedValue(removed);

      await expect(service.remove('abc')).resolves.toEqual(removed);
      expect(cat.delete).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });
  });
});
