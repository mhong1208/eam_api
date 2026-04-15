import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetCategory } from '../entities/asset-category.entity';
import { GetAssetCategoriesDto } from '../dto/get-asset-categories.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, In, Like } from 'typeorm';
import { AssetCategoryRepository } from '../repositories/asset-category.repository';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';

@Injectable()
export class AssetCategoriesService {
  constructor(
    private readonly assetCategoryRepository: AssetCategoryRepository,
  ) { }

  async loadAll(): Promise<AssetCategory[]> {
    return this.assetCategoryRepository.find();
  }

  async findAll(
    getDto: GetAssetCategoriesDto,
  ): Promise<PageDto<AssetCategory>> {
    const page = getDto.pageIndex || 1;
    const limit = getDto.pageSize || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<AssetCategory> = {};

    if (getDto.name) {
      where.name = Like(`%${getDto.name}%`);
    }

    if (getDto.code) {
      where.code = Like(`%${getDto.code}%`);
    }

    const [entities, itemCount] =
      await this.assetCategoryRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: skip,
        take: limit,
      });

    const pageMetaDto = new PageMetaDto(page, limit, itemCount);
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: string): Promise<AssetCategory> {
    const entity = await this.assetCategoryRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Asset Category with ID ${id} not found`);
    }
    return entity;
  }

  async create(data: Partial<AssetCategory>): Promise<AssetCategory> {
    const entity = this.assetCategoryRepository.create(data);
    return this.assetCategoryRepository.save(entity);
  }

  async update(
    id: string,
    data: Partial<AssetCategory>,
  ): Promise<AssetCategory> {
    await this.findById(id);

    const entity = await this.assetCategoryRepository.preload({
      id: id,
      ...data,
    });

    if (!entity) {
      throw new NotFoundException(`Asset Category with ID ${id} not found`);
    }

    return this.assetCategoryRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.assetCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Asset Category with ID ${id} not found`);
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
        const depreciationMonth = Number(row.getCell(3).value) || undefined;
        const description = row.getCell(4).value?.toString()?.trim();

        if (!code || !name) {
          errorRows.push({
            row: rowNumber,
            code: code || '',
            name: name || '',
            reason: 'Mã và Tên danh mục tài sản không được để trống',
          });
        } else {
          validItems.push({ code, name, depreciationMonth, description, _rowNumber: rowNumber });
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

    const existingEntities = await this.assetCategoryRepository.find({
      where: { code: In(codesToInsert) },
      select: ['code'],
    });
    const existingCodes = existingEntities.map(e => e.code);

    const finalToSave: Partial<AssetCategory>[] = [];

    for (const item of validItems) {
      if (existingCodes.includes(item.code)) {
        errorRows.push({
          row: item._rowNumber,
          code: item.code,
          name: item.name,
          reason: 'Mã danh mục tài sản đã tồn tại trong hệ thống',
        });
      } else {
        delete item._rowNumber;
        finalToSave.push(item);
      }
    }

    if (finalToSave.length > 0) {
      await this.assetCategoryRepository.save(finalToSave);
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
