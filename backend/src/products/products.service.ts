import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { Queue } from 'bullmq';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';

import { Product, User, UserFavorite, Order } from '@app/entities';
import { StripeService } from '@app/stripe';
import { DeliveryStatus } from '@app/enums';
import { IOrder } from '@app/interfaces';
import { ReviewDto } from '@app/dto';
import { Review } from '@app/entities';
import { ReceiptService } from 'src/receipt/receipt.service';

@Injectable()
export class ProductsService {
  constructor(
    private dataSource: DataSource,
    private readonly stripeService: StripeService,
    private readonly receiptService: ReceiptService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserFavorite)
    private readonly userFavoriteRepository: Repository<UserFavorite>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectQueue('mail') private readonly queue: Queue,
  ) {}

  async index(query: PaginateQuery): Promise<Paginated<Product>> {
    return paginate<Product>(query, this.productRepository, {
      relations: ['images', 'seller', 'reviews'],
      sortableColumns: [
        'id',
        'createdAt',
        'name',
        'year',
        'price',
        'seller.name',
      ],
      select: [
        'id',
        'name',
        'artist',
        'price',
        'genre',
        'year',
        'createdAt',
        'isActive',
        'images.url',
        'seller.id',
        'seller.name',
        'seller.avatar',
        'seller.isBlocked',
        'reviews.rating',
      ],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
        createdAt: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
        year: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
        price: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
        genre: [FilterOperator.EQ, FilterOperator.IN],
        'seller.name': [
          FilterOperator.EQ,
          FilterOperator.IN,
          FilterOperator.ILIKE,
        ],
      },
    });
  }

  async getOne(id: number): Promise<Product> {
    return this.productRepository
      .createQueryBuilder('p')
      .leftJoin('p.seller', 's')
      .leftJoin('p.images', 'i')
      .leftJoin('p.reviews', 'r')
      .leftJoin('r.user', 'u')
      .select([
        'p.id',
        'p.name',
        'p.description',
        'p.genre',
        'p.price',
        'p.year',
        'p.isActive',
        'p.trackList',
        'p.createdAt',
        's.name',
        'i.url',
        's.id',
        's.name',
        's.avatar',
        's.isBlocked',
        'r.rating',
        'r.comment',
        'r.createdAt',
        'u.id',
        'u.firstName',
        'u.lastName',
        'u.avatar',
      ])
      .where('p.id = :id', { id })
      .getOneOrFail();
  }

  async buy(
    user: User,
    id: number,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const product = await this.productRepository.findOneByOrFail({ id });
    if (!product.isActive) {
      throw new BadRequestException('This product is already sold. Sorry!');
    }
    return this.stripeService.createCheckoutSession(
      user.email,
      product.name,
      product.price,
      { productId: id, userId: user.id },
    );
  }

  async review(user: User, id: number, body: ReviewDto) {
    await this.productRepository.findOneByOrFail({ id });
    let review = await this.reviewRepository.findOneBy({
      userId: user.id,
      productId: id,
    });
    if (review) {
      await this.reviewRepository.update(review.id, body);
    } else {
      review = await this.reviewRepository.save({
        ...body,
        userId: user.id,
        productId: id,
      });
    }
    return { ...review, user };
  }

  async favorite(user: User, id: number) {
    const userId = user.id;

    const product = await this.productRepository.findOneByOrFail({ id });
    const favorite = await this.userFavoriteRepository.findOneBy({
      userId,
      productId: id,
    });

    if (!favorite) {
      await this.userFavoriteRepository.save({
        productId: id,
        userId,
      });
      return {
        status: 'added',
        message: `Product ${product.name} was successfully added to favorites!`,
      };
    }

    await this.userFavoriteRepository.delete(favorite);
    return {
      status: 'removed',
      message: `Product ${product.name} was deleted from favorites`,
    };
  }

  @OnEvent('product.payment_successful', { async: true })
  async processProductBuy(data: IOrder): Promise<void> {
    const { productId, userId, paymentIntentId, paymentIntentStatus } = data;
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!product) {
      throw new NotFoundException(
        'Cannot find product for processing its payment',
      );
    }
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException(
        'Cannot find user for processing its payment',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        Product,
        { id: productId },
        { isActive: false },
      );
      const order = await queryRunner.manager.save(Order, {
        productId,
        userId,
        stripePaymentIntentId: paymentIntentId,
        stripePaymentStatus: paymentIntentStatus,
        deliveryStatus: DeliveryStatus.PENDING,
      });
      const receipt = await this.receiptService.generateReceipt(
        product,
        order,
        user,
      );
      console.log(user.firstName, user.email);
      await this.queue.add('send_receipt_success', {
        firstName: user.firstName,
        email: user.email,
        product,
        order,
        receipt,
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to process product buy: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
