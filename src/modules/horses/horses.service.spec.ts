import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HorsesService } from './horses.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('HorsesService', () => {
  let service: HorsesService;
  let horse: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    horse = { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HorsesService,
        { provide: PrismaService, useValue: { horse } },
      ],
    }).compile();

    service = module.get<HorsesService>(HorsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('returns the horse when it exists', async () => {
      const found = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      horse.findUnique.mockResolvedValue(found);

      await expect(service.findOne('abc')).resolves.toEqual(found);
      expect(horse.findUnique).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });

    it('throws NotFoundException when the horse does not exist', async () => {
      horse.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('returns the updated horse', async () => {
      const updated = { id: 'abc', name: 'Beta', age: 3, breed: 'common' };
      horse.update.mockResolvedValue(updated);

      await expect(service.update('abc', { name: 'Beta' })).resolves.toEqual(
        updated,
      );
      expect(horse.update).toHaveBeenCalledWith({
        where: { id: 'abc' },
        data: { name: 'Beta' },
      });
    });
  });

  describe('remove', () => {
    it('returns the removed horse', async () => {
      const removed = { id: 'abc', name: 'Alpha', age: 3, breed: 'common' };
      horse.delete.mockResolvedValue(removed);

      await expect(service.remove('abc')).resolves.toEqual(removed);
      expect(horse.delete).toHaveBeenCalledWith({ where: { id: 'abc' } });
    });
  });
});
