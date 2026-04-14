import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { Vendor } from '../entities/vendor.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetVendorsDto } from '../dto/get-vendors.dto';
import { PageDto } from '../../../core/dto/pagination.dto';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @ApiOperation({ summary: 'Hàm trả về danh sách các nhà cung cấp' })
    @Get()
    findAll(@Query() getDto: GetVendorsDto): Promise<PageDto<Vendor>> {
        return this.vendorsService.findAll(getDto);
    }

    @ApiOperation({ summary: 'Hàm trả về nhà cung cấp theo ID' })
    @Get(':id')
    findById(@Param('id') id: string): Promise<Vendor> {
        return this.vendorsService.findById(id);
    }

    @ApiOperation({ summary: 'Hàm tạo mới một nhà cung cấp' })
    @Post()
    create(@Body() data: Partial<Vendor>): Promise<Vendor> {
        return this.vendorsService.create(data);
    }

    @ApiOperation({ summary: 'Hàm cập nhật một nhà cung cấp' })
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() data: Partial<Vendor>
    ): Promise<Vendor> {
        return this.vendorsService.update(id, data);
    }

    @ApiOperation({ summary: 'Hàm xóa một nhà cung cấp' })
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.vendorsService.remove(id);
    }
}
