import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../core/dto/pagination.dto';

export class GetDepartmentsDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Mã phòng ban' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên phòng ban' })
  @IsString()
  @IsOptional()
  name?: string;
}
