import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Creation date',
    })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Update date',
    })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}