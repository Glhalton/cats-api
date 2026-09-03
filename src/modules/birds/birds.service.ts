import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBirdDto } from './dto/create-bird.dto.js';
import { UpdateBirdDto } from './dto/update-bird.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class BirdsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBirdDto: CreateBirdDto) {
    return this.prisma.bird.create({ data: createBirdDto });
  }

  findAll() {
    return this.prisma.bird.findMany({});
  }

  async findOne(id: string) {
    const bird = await this.prisma.bird.findUnique({ where: { id } });

    if (!bird) {
      throw new NotFoundException(`Bird with id ${id} not found`);
    }

    return bird;
  }

  update(id: string, updateBirdDto: UpdateBirdDto) {
    return this.prisma.bird.update({ where: { id }, data: updateBirdDto });
  }

  remove(id: string) {
    return this.prisma.bird.delete({ where: { id } });
  }
}
