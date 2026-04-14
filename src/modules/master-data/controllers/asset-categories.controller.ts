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
} from '@nestjs/common';
import { AssetCategoriesService } from '../services/asset-categories.service';
import { AssetCategory } from '../entities/asset-category.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetAssetCategoriesDto } from '../dto/get-asset-categories.dto';
import { PageDto } from '../../../core/dto/pagination.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

@ApiTags('asset-categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('asset-categories')
export class AssetCategoriesController {
  constructor(
    private readonly assetCategoriesService: AssetCategoriesService,
  ) {}

  @ApiOperation({ summary: 'Hàm trả về danh sách các loại tài sản' })
  @Get()
  findAll(
    @Query() getDto: GetAssetCategoriesDto,
  ): Promise<PageDto<AssetCategory>> {
    return this.assetCategoriesService.findAll(getDto);
  }

  @ApiOperation({ summary: 'Hàm trả về loại tài sản theo ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<AssetCategory> {
    return this.assetCategoriesService.findById(id);
  }

  @ApiOperation({ summary: 'Hàm tạo mới một loại tài sản' })
  @Post()
  create(@Body() data: Partial<AssetCategory>): Promise<AssetCategory> {
    return this.assetCategoriesService.create(data);
  }

  @ApiOperation({ summary: 'Hàm cập nhật một loại tài sản' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<AssetCategory>,
  ): Promise<AssetCategory> {
    return this.assetCategoriesService.update(id, data);
  }

  @ApiOperation({ summary: 'Hàm xóa một loại tài sản' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.assetCategoriesService.remove(id);
  }
}
