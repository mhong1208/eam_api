import { Injectable, NotFoundException } from '@nestjs/common';
import { Vendor } from '../entities/vendor.entity';
import { GetVendorsDto } from '../dto/get-vendors.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, In, Like } from 'typeorm';
import { VendorRepository } from '../repositories/vendor.repository';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';

@Injectable()
export class VendorsService {
  constructor(private readonly vendorRepository: VendorRepository) {}

  async loadAll(): Promise<Vendor[]> {
    return this.vendorRepository.find();
  }

  async findAll(getDto: GetVendorsDto): Promise<PageDto<Vendor>> {
    const page = getDto.pageIndex || 1;
    const limit = getDto.pageSize || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Vendor> = {};

    if (getDto.name) {
      where.name = Like(`%${getDto.name}%`);
    }

    if (getDto.code) {
      where.code = Like(`%${getDto.code}%`);
    }

    const [entities, itemCount] = await this.vendorRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });

    const pageMetaDto = new PageMetaDto(page, limit, itemCount);
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: string): Promise<Vendor> {
    const entity = await this.vendorRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return entity;
  }

  async create(data: Partial<Vendor>): Promise<Vendor> {
    const entity = this.vendorRepository.create(data);
    return this.vendorRepository.save(entity);
  }

  async update(id: string, data: Partial<Vendor>): Promise<Vendor> {
    await this.findById(id);

    const entity = await this.vendorRepository.preload({
      id: id,
      ...data,
    });

    if (!entity) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return this.vendorRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.vendorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
  }

  async importExcel(file: Express.Multer.File): Promise<{ message: string; errors: any[]; type: string }> {
    const workbook = new ExcelJS.Workbook();
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    await workbook.xlsx.read(stream);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    const validItems: any[] = [];
    const errorRows: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const code = row.getCell(1).value?.toString()?.trim();
        const name = row.getCell(2).value?.toString()?.trim();
        const phone = row.getCell(3).value?.toString()?.trim();
        const email = row.getCell(4).value?.toString()?.trim();
        const address = row.getCell(5).value?.toString()?.trim();

        if (!code || !name) {
          errorRows.push({
            row: rowNumber,
            code: code || '',
            name: name || '',
            reason: 'Mã và Tên nhà cung cấp không được để trống',
          });
        } else {
          validItems.push({ code, name, phone, email, address, _rowNumber: rowNumber });
        }
      }
    });

    if (validItems.length === 0) {
      return {
        message: 'Không có dữ liệu hợp lệ nào được import.',
        errors: errorRows,
        type: 'error',
      };
    }

    const codesToInsert = validItems.map(item => item.code);

    const existingEntities = await this.vendorRepository.find({
      where: { code: In(codesToInsert) },
      select: ['code'],
    });
    const existingCodes = existingEntities.map(e => e.code);

    const finalToSave: Partial<Vendor>[] = [];

    for (const item of validItems) {
      if (existingCodes.includes(item.code)) {
        errorRows.push({
          row: item._rowNumber,
          code: item.code,
          name: item.name,
          reason: 'Mã nhà cung cấp đã tồn tại trong hệ thống',
        });
      } else {
        delete item._rowNumber;
        finalToSave.push(item);
      }
    }

    if (finalToSave.length > 0) {
      await this.vendorRepository.save(finalToSave);
    }

    return {
      message:
        errorRows.length > 0
          ? `Import dữ liệu thất bại ${errorRows.length} dòng.`
          : `Import dữ liệu thành công ${finalToSave.length} dòng.`,
      errors: errorRows,
      type: errorRows.length > 0 ? 'error' : 'success',
    };
  }

  async updateStatus(id: string, isActive: boolean): Promise<Vendor> {
    const entity = await this.findById(id);
    entity.isActive = isActive;
    return this.vendorRepository.save(entity);
  }
}
