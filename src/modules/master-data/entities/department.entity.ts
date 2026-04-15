import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../core/base.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @ApiProperty({ example: 'HR', description: 'Department code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ example: 'Human Resources', description: 'Department name' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Human resources department description',
    description: 'Description',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @ApiProperty({ example: true, description: 'Department status' })
  @Column({ default: true, nullable: true })
  isActive: boolean
}
