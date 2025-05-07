import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Seller } from '@app/entities';
import { JwtAuthSellerGuard } from '@app/guards';
import { SellerAuthRequest } from '@app/interfaces';

import { SellerService } from './seller.service';

@ApiBearerAuth()
@Controller('seller')
@UseGuards(JwtAuthSellerGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('me')
  me(@Req() { seller }: SellerAuthRequest): Seller {
    return seller;
  }
}
