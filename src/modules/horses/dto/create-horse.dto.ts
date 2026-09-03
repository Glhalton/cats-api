import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateHorseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @IsNotEmpty()
  breed: string;
}
