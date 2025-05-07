import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

import { UploadQueueParams } from '@app/interfaces';

import { UploadService } from './upload.service';

type UploadJobName = 'avatar' | 'product_image';

@Processor('upload')
export class UploadConsumer extends WorkerHost {
  constructor(private readonly service: UploadService) {
    super();
  }

  async process(
    job: Job<UploadQueueParams, string | undefined, UploadJobName>,
  ): Promise<string | undefined> {
    const file = job.data.file;
    const buffer = Buffer.from(file.buffer);
    file.buffer = buffer;

    // TODO refactor
    switch (job.name) {
      case 'avatar':
        return this.service.uploadAvatar(job.data);
      case 'product_image':
        return this.service.uploadProductImage(job.data);
      default:
        console.log('Wrong job name');
        return;
    }
  }
}
