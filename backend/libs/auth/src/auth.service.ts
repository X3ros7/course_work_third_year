import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  decode(token: string): string | { [key: string]: any } {
    return this.jwtService.decode(token);
  }

  async generateToken(
    payload: object | Buffer,
    options?: any,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(payload, options);
    return token;
  }
}
