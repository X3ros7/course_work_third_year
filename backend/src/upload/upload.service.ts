import { Injectable } from '@nestjs/common';

import { UploadQueueParams } from '@app/interfaces';
import { StorageService } from '@app/storage';

@Injectable()
export class UploadService {
  constructor(private readonly storage: StorageService) {}

  async uploadAvatar(data: UploadQueueParams): Promise<string | undefined> {
    const { file, id } = data;
    const bucketName = 'avatars';
    return this.storage.uploadFile(bucketName, file, id);
  }

  async uploadProductImage(
    data: UploadQueueParams,
  ): Promise<string | undefined> {
    const { file, id } = data;
    const bucketName = 'products';
    return await this.storage.uploadFile(bucketName, file, id);
  }
}
