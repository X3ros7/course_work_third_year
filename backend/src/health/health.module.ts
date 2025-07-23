import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [TerminusModule, HttpModule, AppConfigModule],
  controllers: [HealthController],
})
export class HealthModule {}
