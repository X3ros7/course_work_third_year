import { Body, Controller, Post, Res } from '@nestjs/common';

import { Response } from 'express';

import {
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendEmailDto,
} from '@app/dto';

import { IAuthResult } from '@app/interfaces';
import { AppConfigService } from '@app/config';
import { Cookie } from '@app/decorators';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<IAuthResult, 'refreshToken'>> {
    const result = await this.authService.login(dto);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: this.appConfigService.env === 'prod' ? 'none' : 'strict',
      secure: this.appConfigService.env === 'prod',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...tokens } = result;
    return tokens;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<IAuthResult, 'refreshToken'>> {
    const result = await this.authService.verifyEmail(dto);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: this.appConfigService.env === 'prod' ? 'none' : 'strict',
      secure: this.appConfigService.env === 'prod',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...tokens } = result;
    return tokens;
  }

  @Post('resend-email')
  async resendEmail(@Body() dto: ResendEmailDto) {
    return this.authService.resendEmail(dto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('refresh-token')
  async refreshToken(
    @Cookie('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<IAuthResult, 'refreshToken'>> {
    const result = await this.authService.refreshToken(refreshToken);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: this.appConfigService.env === 'prod' ? 'none' : 'strict',
      secure: this.appConfigService.env === 'prod',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken: _, ...tokens } = result;
    return tokens;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
