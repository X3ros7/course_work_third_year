import { Module } from '@nestjs/common';

import { StorageConfigModule } from '@app/config';

import { StorageService } from './storage.service';

@Module({
  imports: [StorageConfigModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
