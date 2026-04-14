import { Injectable, NotFoundException } from '@nestjs/common';
import { Vendor } from '../entities/vendor.entity';
import { GetVendorsDto } from '../dto/get-vendors.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, Like } from 'typeorm';
import { VendorRepository } from '../repositories/vendor.repository';

@Injectable()
export class VendorsService {
  constructor(private readonly vendorRepository: VendorRepository) {}

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
}
