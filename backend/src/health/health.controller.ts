import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AppConfigService } from '@app/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('health')
export class HealthController {
  constructor(
    private readonly http: HttpHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly appConfigService: AppConfigService,
    @InjectPinoLogger(HealthController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get('app')
  checkApp(): string {
    this.logger.info('Checking app health...');
    return 'ok';
  }

  @Get()
  async check(): Promise<HealthCheckResult> {
    this.logger.info('Checking health...');
    return this.health.check([
      () =>
        this.http.pingCheck(
          'Web app',
          `http://${this.appConfigService.host}:${this.appConfigService.port}/api/v1/health/app`,
        ),
      () => this.db.pingCheck('Database Connection'),
    ]);
  }
}
