import { Injectable, Logger } from '@nestjs/common';

import { Client } from 'minio';

import { StorageConfigService } from '@app/config';

@Injectable()
export class StorageService {
  private readonly storageClient: Client;
  private readonly logger: Logger = new Logger(StorageService.name);

  constructor(private readonly config: StorageConfigService) {
    this.storageClient = new Client({
      endPoint: this.config.endPoint,
      port: this.config.port,
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
      useSSL: false,
    });
  }

  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
    id: number,
  ): Promise<string | undefined> {
    const fileName = `${id}/${file.originalname}`;

    try {
      await this.ensureBucketExists(bucketName);

      this.logger.log('Uploading file...');
      await this.storageClient.putObject(bucketName, fileName, file.buffer);
      this.logger.debug(`File uploaded`);
      return this.storageClient.presignedUrl('GET', bucketName, fileName);
    } catch (err) {
      this.logger.error(`Error while uploading file to bucket: ${err}`);
    }
  }

  private async ensureBucketExists(bucketName: string): Promise<void> {
    const exists = await this.storageClient.bucketExists(bucketName);
    if (!exists) {
      this.logger.warn(`Bucket ${bucketName} doesn't exists. Creating it...`);
      await this.storageClient.makeBucket(bucketName);
    }
  }
}
