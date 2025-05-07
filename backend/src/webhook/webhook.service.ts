import {
  Injectable,
  BadRequestException,
  RawBodyRequest,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Request, Response } from 'express';
import Stripe from 'stripe';

import { WebhookConfigService } from '@app/config';
import { StripeService } from '@app/stripe';
import { IOrder } from '@app/interfaces';

@Injectable()
export class WebhookService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly config: WebhookConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handleStripeWebhook(
    req: RawBodyRequest<Request>,
    res: Response,
    signature: string,
  ) {
    const endpointSecret = this.config.stripe;

    let event: Stripe.Event;
    try {
      event = this.stripeService.constructEvent(
        req.rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(
        `Error while handling Stripe webhook: ${err}`,
      );
    }

    if (event && event.type === 'checkout.session.completed') {
      const metadata = event.data.object.metadata;
      if (!metadata) {
        throw new BadRequestException('Metadata not found');
      }

      const paymentIntentId = event.data.object.payment_intent as string;
      if (!paymentIntentId) {
        throw new BadRequestException('Payment intent not found');
      }
      const paymentIntent =
        await this.stripeService.retrievePaymentIntent(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        throw new BadRequestException('Payment failed');
      }

      const params: IOrder = {
        productId: Number(metadata.productId),
        userId: Number(metadata.userId),
        paymentIntentId: paymentIntent.id,
        paymentIntentStatus: paymentIntent.status,
      };

      await this.eventEmitter.emitAsync('product.payment_successful', params);
    }

    return {
      processed: true,
    };
  }
}
