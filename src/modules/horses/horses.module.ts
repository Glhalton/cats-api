import { Module } from '@nestjs/common';
import { HorsesService } from './horses.service.js';
import { HorsesController } from './horses.controller.js';

@Module({
  controllers: [HorsesController],
  providers: [HorsesService],
})
export class HorsesModule {}
