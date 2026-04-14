import { Injectable, NotFoundException } from '@nestjs/common';
import { Asset } from '../entities/asset.entity';
import { GetAssetsDto } from '../dto/get-assets.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, Like } from 'typeorm';
import { AssetRepository } from '../repositories/asset.repository';

@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository) { }

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
}
