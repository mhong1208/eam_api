import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { PageOptionsDto } from '../../../core/dto/pagination.dto';
import { RoleEnum } from '../enums';
import { Type } from 'class-transformer';

export class GetUsersDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiPropertyOptional({ enum: RoleEnum })
  @IsOptional()
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly departmentId?: string;
}
