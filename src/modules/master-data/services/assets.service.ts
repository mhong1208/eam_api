import { Injectable, NotFoundException } from '@nestjs/common';
import { Asset } from '../entities/asset.entity';
import { GetAssetsDto } from '../dto/get-assets.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, In, Like } from 'typeorm';
import { AssetRepository } from '../repositories/asset.repository';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';
import * as QRCode from 'qrcode';
import { AssetStatus } from '../enums';
@Injectable()
export class AssetsService {
  constructor(private readonly assetRepository: AssetRepository) { }

  async loadAll(): Promise<Asset[]> {
    return this.assetRepository.find({ relations: ['category', 'location', 'vendor'] });
  }

  async findAll(getDto: GetAssetsDto): Promise<PageDto<Asset>> {
    const page = getDto.pageIndex || 1;
    const limit = getDto.pageSize || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Asset> = {};

    if (getDto.name) {
      where.name = Like(`%${getDto.name}%`);
    }

    if (getDto.code) {
      where.code = Like(`%${getDto.code}%`);
    }

    if (getDto.categoryId) {
      where.categoryId = getDto.categoryId;
    }

    if (getDto.locationId) {
      where.locationId = getDto.locationId;
    }

    if (getDto.vendorId) {
      where.vendorId = getDto.vendorId;
    }

    const [entities, itemCount] = await this.assetRepository.findAndCount({
      where,
      relations: ['category', 'location', 'vendor'],
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });

    const pageMetaDto = new PageMetaDto(page, limit, itemCount);
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: string): Promise<Asset> {
    const entity = await this.assetRepository.findOne({
      where: { id },
      relations: ['category', 'location', 'vendor'],
    });
    if (!entity) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return entity;
  }

  async create(data: Partial<Asset>): Promise<Asset> {
    const qrData = JSON.stringify({
      code: data.code,
      name: data.name,
      id: data.id
    });
    const qrCode = await QRCode.toDataURL(qrData);
    const entity = this.assetRepository.create(data);
    return this.assetRepository.save(entity);
  }

  async update(id: string, data: Partial<Asset>): Promise<Asset> {
    await this.findById(id);

    const entity = await this.assetRepository.preload({
      id: id,
      ...data,
    });

    if (!entity) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return this.assetRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.assetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
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
        const serialNumber = row.getCell(3).value?.toString()?.trim();
        const purchasePrice = Number(row.getCell(4).value) || undefined;
        const purchaseDate = row.getCell(5).value ? new Date(row.getCell(5).value as any) : undefined;

        if (!code || !name) {
          errorRows.push({
            row: rowNumber,
            code: code || '',
            name: name || '',
            reason: 'Mã và Tên tài sản không được để trống',
          });
        } else {
          validItems.push({ code, name, serialNumber, purchasePrice, purchaseDate, _rowNumber: rowNumber });
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

    const existingEntities = await this.assetRepository.find({
      where: { code: In(codesToInsert) },
      select: ['code'],
    });
    const existingCodes = existingEntities.map(e => e.code);

    const finalToSave: Partial<Asset>[] = [];

    for (const item of validItems) {
      if (existingCodes.includes(item.code)) {
        errorRows.push({
          row: item._rowNumber,
          code: item.code,
          name: item.name,
          reason: 'Mã tài sản đã tồn tại trong hệ thống',
        });
      } else {
        delete item._rowNumber;
        finalToSave.push(item);
      }
    }

    if (finalToSave.length > 0) {
      await this.assetRepository.save(finalToSave);
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

  async updateStatus(id: string, status: AssetStatus): Promise<Asset> {
    const entity = await this.findById(id);
    entity.status = status;
    return this.assetRepository.save(entity);
  }
}
