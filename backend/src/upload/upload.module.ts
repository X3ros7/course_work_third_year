import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { StorageModule } from '@app/storage';

import { UploadService } from './upload.service';
import { UploadConsumer } from './upload.consumer';

@Module({
  imports: [StorageModule, BullModule.registerQueue({ name: 'upload' })],
  providers: [UploadService, UploadConsumer],
  exports: [UploadService],
})
export class UploadModule {}
