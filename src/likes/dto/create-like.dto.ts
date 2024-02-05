import { IsNumber } from 'class-validator';
export class CreateLikeDto {
  @IsNumber()
  sourceId: number;
}
