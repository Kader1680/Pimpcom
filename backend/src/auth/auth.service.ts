import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      ...dto,
      role: Role.CUSTOMER,
    });
    return this.buildResponse(user.id, user.email, user.role, user.name);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account disabled');

    return this.buildResponse(user.id, user.email, user.role, user.name);
  }

  private buildResponse(id: string, email: string, role: string, name: string) {
    const payload = { sub: id, email, role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id, email, role, name },
    };
  }
}
