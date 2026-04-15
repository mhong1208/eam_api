import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { Vendor } from '../entities/vendor.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetVendorsDto } from '../dto/get-vendors.dto';
import { PageDto } from '../../../core/dto/pagination.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) { }

  @ApiOperation({ summary: 'Hàm trả về tất cả nhà cung cấp (không phân trang)' })
  @Get('load-data')
  loadAll() {
    return this.vendorsService.loadAll();
  }

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
    @Body() data: Partial<Vendor>,
  ): Promise<Vendor> {
    return this.vendorsService.update(id, data);
  }

  @ApiOperation({ summary: 'Hàm xóa một nhà cung cấp' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.vendorsService.remove(id);
  }

  @ApiOperation({ summary: 'Hàm cập nhật trạng thái một nhà cung cấp' })
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() data: { isActive: boolean },
  ): Promise<Vendor> {
    return this.vendorsService.updateStatus(id, data.isActive);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    return await this.vendorsService.importExcel(file);
  }
}
