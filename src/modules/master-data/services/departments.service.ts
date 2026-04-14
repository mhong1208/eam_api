import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from '../entities/department.entity';
import { GetDepartmentsDto } from '../dto/get-departments.dto';
import {
    CreateDepartmentDto,
    UpdateDepartmentDto,
} from '../dto/create-department.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, Like } from 'typeorm';
import { DepartmentRepository } from '../repositories/department.repository';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';

@Injectable()
export class DepartmentsService {
    constructor(private readonly departmentRepository: DepartmentRepository) { }

    async findAll(
        getDepartmentsDto: GetDepartmentsDto,
    ): Promise<PageDto<Department>> {
        const page = getDepartmentsDto.pageIndex || 1;
        const limit = getDepartmentsDto.pageSize || 10;
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Department> = {};

        if (getDepartmentsDto.name) {
            where.name = Like(`%${getDepartmentsDto.name}%`);
        }

        if (getDepartmentsDto.code) {
            where.code = Like(`%${getDepartmentsDto.code}%`);
        }

        const [entities, itemCount] = await this.departmentRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: skip,
            take: limit,
        });

        const pageMetaDto = new PageMetaDto(page, limit, itemCount);
        return new PageDto(entities, pageMetaDto);
    }

    async findById(id: string): Promise<Department> {
        const department = await this.departmentRepository.findOneBy({ id });
        if (!department) {
            throw new NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }

    async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
        const department = this.departmentRepository.create(createDepartmentDto);
        return this.departmentRepository.save(department);
    }

    async update(
        id: string,
        updateDepartmentDto: UpdateDepartmentDto,
    ): Promise<Department> {
        await this.findById(id);

        const department = await this.departmentRepository.preload({
            id: id,
            ...updateDepartmentDto,
        });

        if (!department) {
            throw new NotFoundException(`Department with ID ${id} not found`);
        }

        return this.departmentRepository.save(department);
    }

    async remove(id: string): Promise<void> {
        const result = await this.departmentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Department with ID ${id} not found`);
        }
    }

    async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null);

        await workbook.xlsx.read(stream);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('Worksheet not found');
        }

        const departments: Partial<Department>[] = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                // Bỏ qua header
                const code = row.getCell(1).value?.toString();
                const name = row.getCell(2).value?.toString();
                const description = row.getCell(3).value?.toString();

                if (code && name) {
                    departments.push({
                        code,
                        name,
                        description,
                    });
                }
            }
        });

        if (departments.length > 0) {
            await this.departmentRepository.save(departments);
        }
    }
}
