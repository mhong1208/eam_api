import { Entity, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../core/base.entity';
import { Asset } from '../../master-data/entities/asset.entity';
import { User } from '../../auth/entities/user.entity';
import { Location } from '../../master-data/entities/location.entity';
import { HandoverStatus } from '../enums/handover-status.enum';

@Entity('handovers')
export class Handover extends BaseEntity {
  @ApiProperty({ description: 'ID tài sản cụ thể' })
  @Column({ name: 'asset_id' })
  assetId: string;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @ApiProperty({ description: 'ID người nhận tài sản' })
  @Column({ name: 'receiver_id' })
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ApiProperty({ description: 'ID người bàn giao (có thể null nếu công ty bàn giao)' })
  @Column({ name: 'sender_id', nullable: true })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ApiProperty({ description: 'Vị trí sử dụng tài sản' })
  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ApiProperty({ example: '2024-05-20', description: 'Ngày bàn giao thực tế' })
  @Column({ name: 'handover_date', type: 'timestamp', nullable: true })
  handoverDate: Date;

  @ApiProperty({ description: 'Ngày thu hồi thực tế', required: false })
  @Column({ name: 'return_date', type: 'timestamp', nullable: true })
  returnDate: Date;

  @ApiProperty({ enum: HandoverStatus, default: HandoverStatus.PENDING })
  @Column({
    type: 'enum',
    enum: HandoverStatus,
    default: HandoverStatus.PENDING,
  })
  status: HandoverStatus;

  @ApiProperty({ description: 'Tình trạng tài sản khi bàn giao' })
  @Column({ name: 'asset_condition', type: 'text', nullable: true })
  assetCondition: string;

  @ApiProperty({ description: 'Lý do bàn giao' })
  @Column({ name: 'handover_reason', type: 'text', nullable: true })
  handoverReason: string;

  @ApiProperty({ description: 'Ghi chú bổ sung hoặc phụ kiện đi kèm' })
  @Column({ type: 'text', nullable: true })
  notes: string;
}
