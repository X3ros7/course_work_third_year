import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
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
          'http://localhost:3000/api/v1/health/app',
        ),
      () => this.db.pingCheck('Database Connection'),
    ]);
  }
}
