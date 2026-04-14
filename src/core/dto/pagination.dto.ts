import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, IsString } from 'class-validator';

export class PageOptionsDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly pageIndex?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly pageSize?: number = 10;

  get skip(): number {
    return ((this.pageIndex || 1) - 1) * (this.pageSize || 10);
  }
}

export class PageMetaDto {
  @ApiProperty()
  readonly pageIndex: number;

  @ApiProperty()
  readonly pageSize: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(pageIndex: number, pageSize: number, itemCount: number) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.pageSize);
    this.hasPreviousPage = this.pageIndex > 1;
    this.hasNextPage = this.pageIndex < this.pageCount;
  }
}

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
