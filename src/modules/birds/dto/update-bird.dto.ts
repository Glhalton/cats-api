import { PartialType } from '@nestjs/mapped-types';
import { CreateBirdDto } from './create-bird.dto.js';

export class UpdateBirdDto extends PartialType(CreateBirdDto) {}
