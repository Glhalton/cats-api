import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto.js';
import { UpdateCatDto } from './dto/update-cat.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class CatsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCatDto: CreateCatDto) {
    return this.prisma.cat.create({ data: createCatDto });
  }

  findAll() {
    return this.prisma.cat.findMany({});
  }

  async findOne(id: string) {
    const cat = await this.prisma.cat.findUnique({ where: { id } });

    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    return cat;
  }

  update(id: string, updateCatDto: UpdateCatDto) {
    return this.prisma.cat.update({ where: { id }, data: updateCatDto });
  }

  remove(id: string) {
    return this.prisma.cat.delete({ where: { id } });
  }
}
