import { Injectable, NotFoundException } from '@nestjs/common';
import { Location } from '../entities/location.entity';
import { GetLocationsDto } from '../dto/get-locations.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, In, Like } from 'typeorm';
import { LocationRepository } from '../repositories/location.repository';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';

@Injectable()
export class LocationsService {
  constructor(private readonly locationRepository: LocationRepository) { }

  async loadAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findAll(getLocationsDto: GetLocationsDto): Promise<PageDto<Location>> {
    const page = getLocationsDto.pageIndex || 1;
    const limit = getLocationsDto.pageSize || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Location> = {};

    if (getLocationsDto.name) {
      where.name = Like(`%${getLocationsDto.name}%`);
    }

    if (getLocationsDto.code) {
      where.code = Like(`%${getLocationsDto.code}%`);
    }

    const [entities, itemCount] = await this.locationRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });

    const pageMetaDto = new PageMetaDto(page, limit, itemCount);
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: string): Promise<Location> {
    const location = await this.locationRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async findByCode(code: string): Promise<Location> {
    const location = await this.locationRepository.findOneBy({ code });
    if (!location) {
      throw new NotFoundException(`Location with code ${code} not found`);
    }
    return location;
  }

  async create(createLocationData: Partial<Location>): Promise<Location> {
    const location = this.locationRepository.create(createLocationData);
    return this.locationRepository.save(location);
  }

  async update(
    id: string,
    updateLocationData: Partial<Location>,
  ): Promise<Location> {
    // Kiểm tra tồn tại trước khi update
    await this.findById(id);

    const location = await this.locationRepository.preload({
      id: id,
      ...updateLocationData,
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return this.locationRepository.save(location);
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Location with ID ${id} not found`);
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
        const description = row.getCell(3).value?.toString()?.trim();

        if (!code || !name) {
          errorRows.push({
            row: rowNumber,
            code: code || '',
            name: name || '',
            reason: 'Mã và Tên vị trí không được để trống',
          });
        } else {
          validItems.push({ code, name, description, _rowNumber: rowNumber });
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

    const existingEntities = await this.locationRepository.find({
      where: { code: In(codesToInsert) },
      select: ['code'],
    });
    const existingCodes = existingEntities.map(e => e.code);

    const finalToSave: Partial<Location>[] = [];

    for (const item of validItems) {
      if (existingCodes.includes(item.code)) {
        errorRows.push({
          row: item._rowNumber,
          code: item.code,
          name: item.name,
          reason: 'Mã vị trí đã tồn tại trong hệ thống',
        });
      } else {
        delete item._rowNumber;
        finalToSave.push(item);
      }
    }

    if (finalToSave.length > 0) {
      await this.locationRepository.save(finalToSave);
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
}
