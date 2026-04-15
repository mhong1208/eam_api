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
import { LocationsService } from '../services/locations.service';
import { Location } from '../entities/location.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetLocationsDto } from '../dto/get-locations.dto';
import { PageDto } from '../../../core/dto/pagination.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @ApiOperation({ summary: 'Hàm trả về tất cả vị trí (không phân trang)' })
  @Get('load-data')
  loadAll() {
    return this.locationsService.loadAll();
  }

  @ApiOperation({ summary: 'Hàm trả về danh sách các vị trí' })
  @Get()
  findAll(
    @Query() getLocationsDto: GetLocationsDto,
  ): Promise<any> {
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
    @Body() updateLocationData: Partial<Location>,
  ): Promise<Location> {
    return this.locationsService.update(id, updateLocationData);
  }

  @ApiOperation({ summary: 'Hàm xóa một vị trí' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.locationsService.remove(id);
  }

  @ApiOperation({ summary: 'Hàm cập nhật trạng thái một vị trí' })
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() data: { isActive: boolean },
  ): Promise<Location> {
    return this.locationsService.updateStatus(id, data.isActive);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    return await this.locationsService.importExcel(file);
  }
}
