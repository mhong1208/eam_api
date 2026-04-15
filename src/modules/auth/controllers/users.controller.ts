import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { GetUsersDto } from '../dto/get-users.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RoleEnum } from '../enums';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  findAll(@Query() getDto: GetUsersDto) {
    return this.usersService.findAll(getDto);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Lấy chi tiết người dùng' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  create(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto);
  }

  @Put(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(id, updateDto);
  }

  @Post(':id/account')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản (không bao gồm mật khẩu)' })
  updateAccount(@Param('id') id: string, @Body() updateDto: UpdateAccountDto) {
    return this.usersService.updateAccount(id, updateDto);
  }

  @Post(':id/reset-password')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Đặt lại mật khẩu người dùng' })
  resetPassword(@Param('id') id: string, @Body() resetDto: ResetPasswordDto) {
    return this.usersService.resetPassword(id, resetDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Xóa người dùng' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
