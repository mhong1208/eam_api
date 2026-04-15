import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HandoverService } from '../services/handover.service';
import { CreateHandoverDto } from '../dto/create-handover.dto';

@ApiTags('Transfer/Handover')
@Controller('handovers')
export class HandoverController {
  constructor(private readonly handoverService: HandoverService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phiếu bàn giao mới' })
  create(@Body() createHandoverDto: CreateHandoverDto) {
    return this.handoverService.create(createHandoverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách phiếu bàn giao' })
  findAll() {
    return this.handoverService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết phiếu bàn giao' })
  findOne(@Param('id') id: string) {
    return this.handoverService.findOne(id);
  }
}
