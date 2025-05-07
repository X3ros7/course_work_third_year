import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Queue, QueueEvents } from 'bullmq';

import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DeepPartial, Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from '@app/dto';
import { Product, ProductImage, Seller } from '@app/entities';

@Injectable()
export class SellerProductsService {
  private queueEvents: QueueEvents;
  constructor(
    @InjectQueue('upload') private readonly uploadQueue: Queue,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {
    this.queueEvents = new QueueEvents('upload');
  }

  async create(
    seller: Seller,
    dto: CreateProductDto,
    images?: Array<Express.Multer.File>,
  ): Promise<Product> {
    const data: DeepPartial<Product> = {
      ...dto,
      sellerId: seller.id,
    };
    const result = await this.productRepository.save(data);
    if (images) {
      await this.processProductImages(images, result.id);
    }

    return result;
  }

  async index(
    seller: Seller,
    query: PaginateQuery,
  ): Promise<Paginated<Product>> {
    const id = seller.id;
    return paginate<Product>(query, this.productRepository, {
      loadEagerRelations: true,
      relations: ['images'],
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      select: [
        'id',
        'name',
        'artist',
        'description',
        'year',
        'price',
        'isActive',
        'trackList',
        'createdAt',
        'images.url',
      ],
      where: { sellerId: id },
    });
  }

  async findOne(seller: Seller, id: number): Promise<Product> {
    const sellerId = seller.id;
    const result = await this.productRepository
      .createQueryBuilder('p')
      .innerJoin('p.seller', 's')
      .where('s.id = :sellerId', { sellerId })
      .andWhere('p.id = :id', { id })
      .getOne();
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async update(
    seller: Seller,
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const sellerId = seller.id;
    const product = await this.productRepository
      .createQueryBuilder('p')
      .innerJoin('p.seller', 's')
      .where('s.id = :sellerId', { sellerId })
      .andWhere('p.id = :id', { id })
      .getOne();
    if (!product) {
      throw new NotFoundException();
    }

    const result = this.productRepository.merge(product, dto);
    return this.productRepository.save(result);
  }

  async patch(
    seller: Seller,
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    console.log(dto.price);
    const sellerId = seller.id;
    const product = await this.productRepository.findOne({
      where: { id, sellerId },
    });

    if (!product) {
      throw new NotFoundException();
    }

    const result = this.productRepository.merge(product, dto);

    return this.productRepository.save(result);
  }

  async remove(seller: Seller, id: number) {
    const sellerId = seller.id;
    const product = await this.productRepository
      .createQueryBuilder('p')
      .innerJoin('p.seller', 's')
      .where('s.id = :sellerId', { sellerId })
      .andWhere('p.id = :id', { id })
      .getOne();
    if (!product) {
      throw new NotFoundException();
    }
    await this.productRepository.delete({ id: product.id });
    return {
      message: 'Product deleted successfully',
    };
  }

  private async processProductImages(
    images: Array<Express.Multer.File>,
    productId: number,
  ): Promise<void> {
    const jobs = await Promise.all(
      images.map((image) =>
        this.uploadQueue.add(
          'product_image',
          {
            file: image,
            id: productId,
          },
          { removeOnComplete: true },
        ),
      ),
    );

    const urls = await Promise.all(
      jobs.map((job) => job.waitUntilFinished(this.queueEvents)),
    );

    const productImages = urls
      .filter((url) => url)
      .map((url) =>
        this.productImageRepository.merge(new ProductImage(), {
          url,
          productId,
        }),
      );

    if (productImages.length > 0) {
      await this.productImageRepository.save(productImages);
    }
  }
}
