import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'HR', description: 'Mã phòng ban' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Human Resources', description: 'Tên phòng ban' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Mô tả phòng ban',
    description: 'Mô tả',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateDepartmentDto extends CreateDepartmentDto {}
