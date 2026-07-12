import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'newest'])
  sort?: string;
}
