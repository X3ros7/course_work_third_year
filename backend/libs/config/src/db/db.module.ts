import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DbConfigService } from './db.service';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [DbConfigService],
  exports: [DbConfigService],
})
export class DbConfigModule {}
