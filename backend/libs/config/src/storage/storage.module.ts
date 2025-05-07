import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StorageConfigService } from './storage.service';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [StorageConfigService],
  exports: [StorageConfigService],
})
export class StorageConfigModule {}
