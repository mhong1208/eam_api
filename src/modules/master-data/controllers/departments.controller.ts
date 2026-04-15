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
import { FileInterceptor } from '@nestjs/platform-express';
import { DepartmentsService } from '../services/departments.service';
import { Department } from '../entities/department.entity';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { GetDepartmentsDto } from '../dto/get-departments.dto';
import {
    CreateDepartmentDto,
    UpdateDepartmentDto,
} from '../dto/create-department.dto';
import { PageDto } from '../../../core/dto/pagination.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

@ApiTags('departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) { }

    @ApiOperation({ summary: 'Hàm trả về tất cả phòng ban (không phân trang)' })
    @Get('load-data')
    loadAll() {
        return this.departmentsService.loadAll();
    }

    @ApiOperation({ summary: 'Hàm trả về danh sách các phòng ban' })
    @Get()
    findAll(
        @Query() getDepartmentsDto: GetDepartmentsDto,
    ): Promise<PageDto<Department>> {
        return this.departmentsService.findAll(getDepartmentsDto);
    }

    @ApiOperation({ summary: 'Hàm trả về phòng ban theo ID' })
    @Get(':id')
    findById(@Param('id') id: string): Promise<Department> {
        return this.departmentsService.findById(id);
    }

    @ApiOperation({ summary: 'Hàm tạo mới một phòng ban' })
    @Post()
    create(
        @Body() createDepartmentDto: CreateDepartmentDto,
    ): Promise<Department> {
        return this.departmentsService.create(createDepartmentDto);
    }

    @ApiOperation({ summary: 'Hàm cập nhật một phòng ban' })
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
    ): Promise<Department> {
        return this.departmentsService.update(id, updateDepartmentDto);
    }

    @ApiOperation({ summary: 'Hàm xóa một phòng ban' })
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.departmentsService.remove(id);
    }

    @ApiOperation({ summary: 'Import danh sách phòng ban từ file Excel' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async import(@UploadedFile() file: Express.Multer.File) {
        return await this.departmentsService.importExcel(file);
    }
}
