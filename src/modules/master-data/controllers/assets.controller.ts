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
import { AssetsService } from '../services/assets.service';
import { Asset } from '../entities/asset.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetAssetsDto } from '../dto/get-assets.dto';
import { PageDto } from '../../../core/dto/pagination.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @ApiOperation({ summary: 'Hàm trả về tất cả tài sản (không phân trang)' })
  @Get('load-data')
  loadAll() {
    return this.assetsService.loadAll();
  }

  @ApiOperation({ summary: 'Hàm trả về danh sách các tài sản' })
  @Get()
  findAll(@Query() getDto: GetAssetsDto): Promise<PageDto<Asset>> {
    return this.assetsService.findAll(getDto);
  }

  @ApiOperation({ summary: 'Hàm trả về tài sản theo ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<Asset> {
    return this.assetsService.findById(id);
  }

  @ApiOperation({ summary: 'Hàm tạo mới một tài sản' })
  @Post()
  create(@Body() data: Partial<Asset>): Promise<Asset> {
    return this.assetsService.create(data);
  }

  @ApiOperation({ summary: 'Hàm cập nhật một tài sản' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<Asset>,
  ): Promise<Asset> {
    return this.assetsService.update(id, data);
  }

  @ApiOperation({ summary: 'Hàm xóa một tài sản' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.assetsService.remove(id);
  }

  @ApiOperation({ summary: 'Hàm cập nhật trạng thái một tài sản' })
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() data: { isActive: boolean },
  ): Promise<Asset> {
    return this.assetsService.updateStatus(id, data.isActive);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    return await this.assetsService.importExcel(file);
  }
}
