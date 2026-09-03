import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHorseDto } from './dto/create-horse.dto.js';
import { UpdateHorseDto } from './dto/update-horse.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class HorsesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createHorseDto: CreateHorseDto) {
    return this.prisma.horse.create({ data: createHorseDto });
  }

  findAll() {
    return this.prisma.horse.findMany({});
  }

  async findOne(id: string) {
    const horse = await this.prisma.horse.findUnique({ where: { id } });

    if (!horse) {
      throw new NotFoundException(`Horse with id ${id} not found`);
    }

    return horse;
  }

  update(id: string, updateHorseDto: UpdateHorseDto) {
    return this.prisma.horse.update({ where: { id }, data: updateHorseDto });
  }

  remove(id: string) {
    return this.prisma.horse.delete({ where: { id } });
  }
}
