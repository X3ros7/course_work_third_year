import { Injectable } from '@nestjs/common';

import {
  SendCodeMailQueueParams,
  SendMailParams,
  SendMailQueueParams,
  SendReceiptSuccessMailQueueParams,
} from '@app/interfaces';
import { MailgunService } from '@app/mailgun';

@Injectable()
export class MailerService {
  constructor(private readonly mailgunService: MailgunService) {}

  async sendCode(queueParams: SendCodeMailQueueParams): Promise<void> {
    const mailParams: SendMailParams = {
      subject: 'Verify registration',
      to: queueParams.email,
      template: 'verify_code',
      vars: {
        firstName: queueParams.firstName,
        activationCode: queueParams.code,
      },
    };
    await this.mailgunService.send(mailParams);
  }

  async sendChangePassword(queueParams: SendMailQueueParams): Promise<void> {
    const mailParams: SendMailParams = {
      subject: 'Password changed',
      to: queueParams.email,
      template: 'password_change',
      vars: {
        firstName: queueParams.firstName,
      },
    };

    await this.mailgunService.send(mailParams);
  }

  async sendReceiptSuccess(
    queueParams: SendReceiptSuccessMailQueueParams,
  ): Promise<void> {
    const { firstName, order, receipt } = queueParams;
    const mailParams: SendMailParams = {
      subject: 'Receipt success',
      to: queueParams.email,
      html: this.generateReceiptEmailHtml({
        firstName,
        orderNumber: order.id,
        date: String(order.createdAt),
        product: queueParams.product,
      }),
      attachments: [
        {
          filename: 'receipt.pdf',
          content: receipt,
        },
      ],
    };

    await this.mailgunService.send(mailParams);
  }

  private generateReceiptEmailHtml(params: {
    firstName: string;
    orderNumber: number;
    date: string;
    product: {
      name: string;
      price: number;
    };
  }): string {
    const { firstName, orderNumber, date, product } = params;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SoundSphere Receipt</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
          }
          .header {
              background-color: #1a1a1a;
              color: #ffffff;
              padding: 30px;
              text-align: center;
          }
          .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
          }
          .content {
              background-color: #ffffff;
              padding: 30px;
          }
          .receipt-box {
              border: 1px solid #e0e0e0;
              border-radius: 5px;
              padding: 20px;
              margin: 20px 0;
          }
          .receipt-details {
              margin-bottom: 20px;
          }
          .item-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #f0f0f0;
          }
          .total-row {
              display: flex;
              justify-content: space-between;
              padding: 15px 0;
              font-weight: bold;
              border-top: 2px solid #e0e0e0;
          }
          .footer {
              text-align: center;
              padding: 20px;
              color: #666666;
              font-size: 12px;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <div class="logo">SoundSphere</div>
              <div>Digital Receipt</div>
          </div>
          
          <div class="content">
              <h2>Thank you for your purchase, ${firstName}!</h2>
              
              <p>We're excited to confirm your order at SoundSphere. Your digital content will be available shortly.</p>
              
              <div class="receipt-box">
                  <div class="receipt-details">
                      <strong>Order Number:</strong> ${orderNumber}<br>
                      <strong>Date:</strong> ${formattedDate}<br>
                  </div>
                  
                  <div class="item-row">
                      <div><strong>Item</strong></div>
                      <div><strong>Price</strong></div>
                  </div>
                  
                  <div class="item-row">
                      <div>${product.name}</div>
                      <div>$${product.price.toFixed(2)}</div>
                  </div>
                  
                  <div class="total-row">
                      <div>Total</div>
                      <div>$${product.price.toFixed(2)}</div>
                  </div>
              </div>
              
              <p>A PDF copy of your receipt is attached to this email for your records.</p>
              
              <center>
                  <a href="https://soundsphere.com/orders/${orderNumber}" class="button">View Order Details</a>
              </center>
          </div>
          
          <div class="footer">
              <p>This is an automated email, please do not reply directly to this message.</p>
              <p>© ${new Date().getFullYear()} SoundSphere. All rights reserved.</p>
              <p>If you have any questions, please contact our support at support@soundsphere.com</p>
          </div>
      </div>
  </body>
  </html>
  `;
  }
}
