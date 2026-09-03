import { Module } from '@nestjs/common';
import { BirdsService } from './birds.service.js';
import { BirdsController } from './birds.controller.js';

@Module({
  controllers: [BirdsController],
  providers: [BirdsService],
})
export class BirdsModule {}
