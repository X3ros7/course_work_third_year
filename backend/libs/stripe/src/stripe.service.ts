import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';

import { StripeConfigService } from '@app/config';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly config: StripeConfigService) {
    this.stripe = new Stripe(this.config.secret, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(
    customerEmail: string,
    name: string,
    price: number,
    metadata?: any,
    currency: string = 'usd',
  ) {
    const productId = metadata?.productId as string;
    return this.stripe.checkout.sessions.create({
      customer_email: customerEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { name },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.config.redirectUrl}/${productId}?success=true`,
      cancel_url: `${this.config.redirectUrl}/${productId}?cancel=true`,
      metadata,
    });
  }

  constructEvent(payload: any, signature: string, secret: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  async retrievePaymentIntent(paymentIntent: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntent);
  }
}
