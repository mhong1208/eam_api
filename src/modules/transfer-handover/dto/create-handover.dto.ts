import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { HandoverStatus } from '../enums/handover-status.enum';

export class CreateHandoverDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  assetId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  senderId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  handoverDate?: string;

  @ApiProperty({ enum: HandoverStatus, required: false })
  @IsOptional()
  @IsEnum(HandoverStatus)
  status?: HandoverStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assetCondition?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  handoverReason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
