import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Product, Order, User } from '@app/entities';

@Injectable()
export class ReceiptService {
  private doc: PDFKit.PDFDocument;

  constructor() {
    this.doc = new PDFDocument({ margin: 50 });
  }

  generateReceipt(product: Product, order: Order, user: User): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];

      this.doc.on('data', (chunk) => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add title
      this.doc.fontSize(20).text('RECEIPT', 50, 50, { align: 'center' });

      // Add receipt details
      this.doc
        .fontSize(12)
        .moveDown()
        .text(`Order Number: ${order.id}`)
        .text(`Date: ${order.createdAt.toLocaleDateString()}`)
        .moveDown()
        .text('Bill To:')
        .text(`${user.firstName} ${user.lastName}`)
        .text(user.email)
        .moveDown();

      // Add table header
      const tableTop = 250;
      this.doc
        .fontSize(10)
        .text('Item', 50, tableTop)
        .text('Price', 400, tableTop);

      // Add line
      this.doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Add item
      const itemTop = tableTop + 25;
      this.doc
        .text(product.name, 50, itemTop)
        .text(`$${Number(product.price).toFixed(2)}`, 400, itemTop);

      // Add total
      this.doc
        .moveDown(2)
        .fontSize(12)
        .text(`Total: $${Number(product.price).toFixed(2)}`, 400);

      // Add footer
      this.doc
        .fontSize(10)
        .moveDown(4)
        .text('Thank you for your purchase!', 50, undefined, {
          align: 'center',
        })
        .text('For any questions, please contact support@yourstore.com', {
          align: 'center',
        });

      this.doc.end();
    });
  }
}
