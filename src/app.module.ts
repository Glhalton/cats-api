import { Module } from '@nestjs/common';
import { CatsModule } from './modules/cats/cats.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { DogsModule } from './modules/dogs/dogs.module.js';
import { BirdsModule } from './modules/birds/birds.module.js';
import { HorsesModule } from './modules/horses/horses.module.js';

@Module({
  imports: [PrismaModule, CatsModule, DogsModule, HorsesModule, BirdsModule],
})
export class AppModule {}
