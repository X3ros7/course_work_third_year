import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger: Logger = new Logger(SchedulerService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

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
