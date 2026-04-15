import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../core/base.entity';
import { AssetCategory } from './asset-category.entity';
import { Vendor } from './vendor.entity';
import { Location } from './location.entity';

import { AssetStatus } from '../enums';

@Entity('assets')
export class Asset extends BaseEntity {
  @ApiProperty({ example: 'AST-0001', description: 'Asset code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ example: 'Dell XPS 15', description: 'Asset name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'QR-0001', description: 'QR Code' })
  @Column({ nullable: true })
  qrCode: string;

  @ApiProperty({ example: 'SN-0001', description: 'Serial Number' })
  @Column({ nullable: true })
  serialNumber: string;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => AssetCategory)
  @JoinColumn({ name: 'category_id' })
  category: AssetCategory;

  @ApiProperty({ example: 1, description: 'Location ID' })
  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  @Column({ name: 'vendor_id', nullable: true })
  vendorId: number;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @ApiProperty({ example: 1500, description: 'Purchase price' })
  @Column({
    name: 'purchase_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  purchasePrice: number;

  @ApiProperty({ example: '2024-01-01', description: 'Purchase date' })
  @Column({ name: 'purchase_date', type: 'date', nullable: true })
  purchaseDate: Date;

  @ApiProperty({ example: '2024-01-01', description: 'Warranty end date' })
  @Column({ name: 'warranty_end_date', type: 'date', nullable: true })
  warrantyEndDate: Date;

  @ApiProperty({
    description: 'Category status',
  })
  @Column({ default: true, nullable: true })
  isActive: boolean
}
