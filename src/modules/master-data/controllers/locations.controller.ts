import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { LocationsService } from '../services/locations.service';
import { Location } from '../entities/location.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetLocationsDto } from '../dto/get-locations.dto';
import { PageDto } from '../../../core/dto/pagination.dto';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) { }

    @ApiOperation({ summary: 'Hàm trả về danh sách các vị trí' })
    @Get()
    findAll(@Query() getLocationsDto: GetLocationsDto): Promise<PageDto<Location>> {
        return this.locationsService.findAll(getLocationsDto);
    }

    @ApiOperation({ summary: 'Hàm trả về vị trí theo ID' })
    @Get(':id')
    findById(@Param('id') id: string): Promise<Location> {
        return this.locationsService.findById(id);
    }

    @ApiOperation({ summary: 'Hàm tạo mới một vị trí' })
    @Post()
    create(@Body() createLocationData: Partial<Location>): Promise<Location> {
        return this.locationsService.create(createLocationData);
    }

    @ApiOperation({ summary: 'Hàm cập nhật một vị trí' })
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateLocationData: Partial<Location>
    ): Promise<Location> {
        return this.locationsService.update(id, updateLocationData);
    }

    @ApiOperation({ summary: 'Hàm xóa một vị trí' })
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.locationsService.remove(id);
    }
}
