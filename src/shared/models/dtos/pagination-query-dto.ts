import { IsNumber, IsOptional, IsPositive } from '@nestjs/class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  offset: number;
}
