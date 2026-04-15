import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { GetUsersDto } from '../dto/get-users.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { PageDto, PageMetaDto } from '../../../core/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { Department } from 'src/modules/master-data/entities/department.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

  async loadAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAll(getDto: GetUsersDto): Promise<PageDto<User>> {
    const page = getDto.pageIndex || 1;
    const limit = getDto.pageSize || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User>[] = [];

    if (getDto.search) {
      where.push(
        { email: Like(`%${getDto.search}%`) },
        { username: Like(`%${getDto.search}%`) },
        { fullName: Like(`%${getDto.search}%`) },
      );
    } else {
      where.push({});
    }

    where.forEach((condition) => {
      if (getDto.role) condition.role = getDto.role;
      if (getDto.isActive !== undefined) condition.isActive = getDto.isActive;
      if (getDto.departmentId) condition.departmentId = getDto.departmentId;
    });

    const [entities, itemCount] = await this.userRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      relations: ['department'],
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });

    const pageMetaDto = new PageMetaDto(page, limit, itemCount);
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: string): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return entity;
  }

  async create(data: CreateUserDto): Promise<User> {
    const { email, fullName, role, departmentId } = data;
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      select: ['code'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }
    const code = await this.generateUserCode(department.code)

    const existingUser = await this.userRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      throw new ConflictException('Tài khoản đã tồn tại');
    }

    const entity = this.userRepository.create({
      ...data,
      code
    });

    const savedUser = await this.userRepository.save(entity);
    return savedUser;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy nhân viên hợp lệ')
    }

    const updatedUser = await this.userRepository.preload({
      id: id,
      ...data,
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const savedUser = await this.userRepository.save(updatedUser);
    return savedUser;
  }

  async updateAccount(id: string, data: UpdateAccountDto): Promise<User> {
    const user = await this.findById(id);

    if (data.email || data.username) {
      const existingUser = await this.userRepository.findOne({
        where: [
          ...(data.email ? [{ email: data.email }] : []),
          ...(data.username ? [{ username: data.username }] : []),
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Tài khoản hoặc email đã tồn tại');
      }
    }

    Object.assign(user, data);
    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async resetPassword(id: string, data: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.findById(id);
    user.password = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Đặt lại mật khẩu thành công' };
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async generateUserCode(departmentCode: string): Promise<string> {
    const prefix = 'DNC';
    const fullPrefix = `${prefix}_${departmentCode}`;

    const lastUser = await this.userRepository.findOne({
      where: {
        code: Like(`${fullPrefix}%`),
      },
      order: { code: 'DESC' },
    });

    let nextNumber = 1;

    if (lastUser) {
      const lastCode = lastUser.code;

      const lastNumber = parseInt(
        lastCode.substring(fullPrefix.length),
        10,
      );

      nextNumber = (isNaN(lastNumber) ? 0 : lastNumber) + 1;
    }

    const numberString = String(nextNumber).padStart(3, '0');

    return `${fullPrefix}${numberString}`;
  }
}
