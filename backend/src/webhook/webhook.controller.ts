import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { Request, Response } from 'express';

import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @ApiOperation({ description: 'Method for handling Stripe webhook' })
  @Post()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.webhookService.handleStripeWebhook(req, res, signature);
  }
}
