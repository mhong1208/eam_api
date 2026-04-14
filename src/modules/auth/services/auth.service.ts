import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { email, username, password, fullName } = registerDto;
    const code = await this.generateUserCode();

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Tài khoản đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      code,
      email,
      username,
      password: hashedPassword,
      fullName,
    });

    await this.userRepository.save(user);

    delete user.password;
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password', 'role', 'isActive'],
    });

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    delete user.password;

    return {
      accessToken,
      user,
    };
  }

  async validateUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async generateUserCode(): Promise<string> {
    const prefix = 'USER';
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateString = `${day}${month}${year}`;

    const lastUser = await this.userRepository.findOne({
      where: { code: Like(`${prefix}${dateString}%`) },
      order: { code: 'DESC' },
    });

    let nextNumber = 1;
    if (lastUser) {
      const lastCode = lastUser.code;
      const lastNumber = parseInt(
        lastCode.substring(prefix.length + dateString.length),
      );
      nextNumber = lastNumber + 1;
    }

    const numberString = String(nextNumber).padStart(3, '0');
    return `${prefix}${dateString}${numberString}`;
  }
}
