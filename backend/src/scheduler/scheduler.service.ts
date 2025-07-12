import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectPinoLogger(SchedulerService.name)
    private readonly logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteUnverifiedUsers(): Promise<void> {
    this.logger.debug('Starting delete of unverified users...');
    await this.eventEmitter.emitAsync('users.delete_unverified');
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async deleteCodes(): Promise<void> {
    this.logger.debug('Starting delete of unused register codes...');
    await this.eventEmitter.emitAsync('auth.delete_codes');
  }
}
