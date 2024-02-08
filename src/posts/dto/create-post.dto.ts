import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreatePostDto {
  @IsNumber()
  @IsOptional()
  sourceId?: number;

  @IsString()
  @IsOptional()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;
}
