import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto.js';
import { UpdateDogDto } from './dto/update-dog.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class DogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDogDto: CreateDogDto) {
    return this.prisma.dog.create({ data: createDogDto });
  }

  findAll() {
    return this.prisma.dog.findMany({});
  }

  async findOne(id: string) {
    const dog = await this.prisma.dog.findUnique({ where: { id } });

    if (!dog) {
      throw new NotFoundException(`Dog with id ${id} not found`);
    }

    return dog;
  }

  update(id: string, updateDogDto: UpdateDogDto) {
    return this.prisma.dog.update({ where: { id }, data: updateDogDto });
  }

  remove(id: string) {
    return this.prisma.dog.delete({ where: { id } });
  }
}
