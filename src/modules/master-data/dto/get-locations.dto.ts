import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../core/dto/pagination.dto';

export class GetLocationsDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Code' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Parent location ID' })
  @IsOptional()
  parentId?: number;
}
