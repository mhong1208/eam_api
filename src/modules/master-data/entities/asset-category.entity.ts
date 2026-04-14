import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../core/base.entity';
import { StatusEnum } from '../enums';

@Entity('asset_categories')
export class AssetCategory extends BaseEntity {
    @ApiProperty({ example: 'LAPTOP', description: 'Category code' })
    @Column({ unique: true })
    code: string;

    @ApiProperty({ example: 'Laptop computers', description: 'Category name' })
    @Column()
    name: string;

    @ApiProperty({ example: 20, description: 'Depreciation months' })
    @Column({ type: 'int', nullable: true })
    depreciationMonth: number;

    @ApiProperty({ example: 'Electronic computing devices', description: 'Description' })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ enum: StatusEnum, example: StatusEnum.ACTIVE, description: 'Category status' })
    @Column({
        type: 'varchar',
        enum: StatusEnum,
        default: StatusEnum.ACTIVE,
    })
    status: StatusEnum;
}
