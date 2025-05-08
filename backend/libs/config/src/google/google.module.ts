import { Module } from '@nestjs/common';
import { GoogleConfigService } from './google.service';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [GoogleConfigService],
  exports: [GoogleConfigService],
})
export class GoogleConfigModule {}
