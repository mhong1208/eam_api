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

  async findAll(getLocationsDto: GetLocationsDto): Promise<any[]> {
    const { name, code } = getLocationsDto;

    const where: FindOptionsWhere<Location> = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (code) {
      where.code = Like(`%${code}%`);
    }

    const locations = await this.locationRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return this.buildTree(locations);
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

  async importExcel(
    file: Express.Multer.File,
  ): Promise<{ message: string; errors: any[]; type: string }> {
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
        const code = row.getCell(2).value?.toString()?.trim();
        const name = row.getCell(1).value?.toString()?.trim();
        const description = row.getCell(5).value?.toString()?.trim();
        const parentCode = row.getCell(4).value?.toString()?.trim();
        const locationType = row.getCell(3).value?.toString()?.trim();

        if (!code || !name) {
          errorRows.push({
            row: rowNumber,
            code: code || '',
            name: name || '',
            reason: 'Mã và Tên vị trí không được để trống',
          });
        } else {
          validItems.push({
            code,
            name,
            description,
            parentCode,
            locationType,
            _rowNumber: rowNumber,
          });
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

    const codes = validItems.map(item => item.code);

    const existingEntities = await this.locationRepository.find({
      where: { code: In(codes) },
    });

    const existingMap = new Map(
      existingEntities.map(e => [e.code, e]),
    );

    const parentCodes = validItems
      .map(i => i.parentCode)
      .filter(Boolean);

    const parentEntities = await this.locationRepository.find({
      where: { code: In(parentCodes) },
      select: ['id', 'code'],
    });

    const parentMap = new Map(parentEntities.map(p => [p.code, p.id]));

    const finalToSave: Partial<Location>[] = [];

    for (const item of validItems) {
      let parentId;

      if (item.parentCode) {
        if (!parentMap.has(item.parentCode)) {
          errorRows.push({
            row: item._rowNumber,
            code: item.code,
            name: item.name,
            reason: `ParentCode không tồn tại: ${item.parentCode}`,
          });
          continue;
        }
        parentId = parentMap.get(item.parentCode) ?? null;
      }

      const existing = existingMap.get(item.code);

      if (existing) {
        finalToSave.push({
          id: existing.id,
          code: item.code,
          name: item.name,
          description: item.description,
          parentId,
          locationType: item.locationType || null,
        });
      } else {
        finalToSave.push({
          code: item.code,
          name: item.name,
          description: item.description,
          parentId,
          locationType: item.locationType || null,
        });
      }
    }

    if (finalToSave.length > 0) {
      await this.locationRepository.save(finalToSave);
    }

    return {
      message:
        errorRows.length > 0
          ? `Import hoàn tất: ${finalToSave.length} dòng thành công, ${errorRows.length} dòng lỗi.`
          : `Import thành công ${finalToSave.length} dòng.`,
      errors: errorRows,
      type: errorRows.length > 0 ? 'error' : 'success',
    };
  }

  async updateStatus(id: string, isActive: boolean): Promise<Location> {
    const entity = await this.findById(id);
    entity.isActive = isActive;
    return this.locationRepository.save(entity);
  }

  private buildTree(data: Location[]): any[] {
    const map = new Map<string, any>();
    const roots: any[] = [];

    data.forEach(item => {
      map.set(item.id, {
        ...item,
        children: [],
        hasChildren: false,
        level: 0,
      });
    });

    data.forEach(item => {
      const node = map.get(item.id);

      if (item.parentId) {
        const parent = map.get(item.parentId.toString());

        if (parent) {
          node.level = parent.level + 1;
          parent.children.push(node);
          parent.hasChildren = true;
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
