import { Module } from '@nestjs/common';
import { CatsService } from './cats.service.js';
import { CatsController } from './cats.controller.js';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
