import { Injectable, NotFoundException } from '@nestjs/common';
import { Location } from '../entities/location.entity';
import { GetLocationsDto } from '../dto/get-locations.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import { FindOptionsWhere, Like } from 'typeorm';
import { LocationRepository } from '../repositories/location.repository';

@Injectable()
export class LocationsService {
  constructor(private readonly locationRepository: LocationRepository) {}

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
}
