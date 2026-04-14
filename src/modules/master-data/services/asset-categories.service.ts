import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetCategory } from '../entities/asset-category.entity';
import { GetAssetCategoriesDto } from '../dto/get-asset-categories.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, Like } from 'typeorm';
import { AssetCategoryRepository } from '../repositories/asset-category.repository';

@Injectable()
export class AssetCategoriesService {
  constructor(
    private readonly assetCategoryRepository: AssetCategoryRepository,
  ) {}

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
}
