import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../core/base.entity';
import { StatusEnum } from '../enums';

@Entity('vendors')
export class Vendor extends BaseEntity {
  @ApiProperty({ example: 'VND001', description: 'Vendor code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ example: 'Global Systems Inc.', description: 'Vendor name' })
  @Column()
  name: string;

  @ApiProperty({ example: '+1-555-0123', description: 'Phone number' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    example: 'contact@globalsys.com',
    description: 'Email address',
  })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    example: '123 Tech Lane, Silicon Valley, CA',
    description: 'Office address',
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    enum: StatusEnum,
    example: StatusEnum.ACTIVE,
    description: 'Vendor status',
  })
  @Column({
    type: 'varchar',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
