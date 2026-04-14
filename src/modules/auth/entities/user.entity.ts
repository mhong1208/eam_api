import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../enums';
import { Department } from '../../master-data/entities/department.entity';


@Entity('users')
export class User extends BaseEntity {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email of the user',
    })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        example: 'john_doe',
        description: 'Username of the user',
    })
    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password?: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the user',
    })
    @Column({ name: 'full_name', nullable: true })
    fullName: string;

    @ApiProperty({
        example: true,
        description: 'Trạng thái hoạt động của người dùng',
    })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({
        example: 'ADMIN',
        description: 'Vai trò của người dùng',
        enum: RoleEnum,
    })
    @Column({ default: RoleEnum.USER })
    role: RoleEnum;

    @ApiProperty({ description: 'ID phòng ban', required: false })
    @Column({ name: 'department_id', nullable: true })
    departmentId: string;

    @ManyToOne(() => Department, (department) => department.users)
    @JoinColumn({ name: 'department_id' })
    department: Department;
}
