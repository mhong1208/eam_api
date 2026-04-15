import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../core/base.entity';
import { StatusEnum } from '../enums';

@Entity('locations')
export class Location extends BaseEntity {
  @ApiProperty({ example: 'A-01-01', description: 'Location code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    example: 'Aisle A, Rack 01, Level 01',
    description: 'Location name',
  })
  @Column()
  name: string;

  @ApiProperty({
    enum: StatusEnum,
    example: StatusEnum.ACTIVE,
    description: 'Location status',
  })
  @Column({
    type: 'varchar',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ApiProperty({ example: 'Description', description: 'Description' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: 1, description: 'Parent location ID' })
  @Column({ nullable: true })
  parentId: number;

  @ApiProperty({
    description: 'Category status',
  })
  @Column({ default: true, nullable: true })
  isActive: boolean
}
