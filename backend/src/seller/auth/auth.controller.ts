import { Body, Controller, Post } from '@nestjs/common';

import { LoginSellerDto, RegisterSellerDto } from '@app/dto';
import { IAuthResult } from '@app/interfaces';

import { SellerAuthService } from './auth.service';

@Controller('seller/auth')
export class SellerAuthController {
  constructor(private readonly authService: SellerAuthService) {}

  @Post('login')
  async login(@Body() dto: LoginSellerDto): Promise<IAuthResult> {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterSellerDto): Promise<IAuthResult> {
    return this.authService.register(dto);
  }
}
