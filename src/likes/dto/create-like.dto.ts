import { IsIn, IsNumber, IsString } from 'class-validator';
const likeForValues = ['post', 'comment'] as const;
export type LikeFor = (typeof likeForValues)[number];
export class CreateLikeDto {
  @IsString()
  @IsIn(likeForValues)
  likeFor: LikeFor;
  @IsNumber()
  sourceId: number;
}
