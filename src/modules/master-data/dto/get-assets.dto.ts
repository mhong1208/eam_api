import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { PageOptionsDto } from '../../../core/dto/pagination.dto';

export class GetAssetsDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Code' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Location ID' })
  @IsNumber()
  @IsOptional()
  locationId?: number;

  @ApiPropertyOptional({ description: 'Vendor ID' })
  @IsNumber()
  @IsOptional()
  vendorId?: number;
}
