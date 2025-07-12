import { Injectable } from '@nestjs/common';
import pino from 'pino';
import { multistream } from 'pino-multi-stream';

@Injectable()
export class LoggerService {
  private logger: pino.Logger;

  constructor() {
    const isDev = process.env.ENVIRONMENT === 'development';

    // Настройка стримов для разных выходов
    const streams = [
      // Консольный вывод (только для разработки)
      ...(isDev
        ? [
            {
              level: 'debug',
              stream: pino.destination({
                sync: false,
              }),
            },
          ]
        : []),

      // Loki стрим
      {
        level: process.env.LOG_LEVEL || 'info',
        stream: pino.transport({
          target: 'pino-loki',
          options: {
            batching: true,
            interval: 5000,
            host: process.env.LOKI_HOST || 'http://localhost:3100',
            labels: {
              app: 'nestjs-app',
              environment: process.env.ENVIRONMENT || 'development',
              service: 'backend',
              version: process.env.APP_VERSION || '1.0.0',
            },
            timeout: 30000,
            silenceErrors: false,
          },
        }) as pino.DestinationStream,
      },
    ];

    // Создаем логгер с мультистримом
    this.logger = pino(
      {
        level: process.env.LOG_LEVEL || 'info',
        base: {
          pid: process.pid,
          hostname: process.env.HOST || 'localhost',
          service: 'nestjs-app',
          environment: process.env.ENVIRONMENT || 'development',
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level(label) {
            return { level: label };
          },
          log(object) {
            return {
              ...object,
              timestamp: new Date().toISOString(),
            };
          },
        },
        // Красивый вывод для разработки
        ...(isDev && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }),
      },
      // Используем мультистрим только в продакшене
      !isDev ? multistream(streams) : undefined,
    );
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info({ context, ...meta }, message);
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error({ trace, context, ...meta }, message);
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn({ context, ...meta }, message);
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug({ context, ...meta }, message);
  }

  verbose(message: string, context?: string, meta?: any) {
    this.logger.trace({ context, ...meta }, message);
  }

  fatal(message: string, context?: string, meta?: any) {
    this.logger.fatal({ context, ...meta }, message);
  }

  // Прямой доступ к pino логгеру
  getPinoLogger(): pino.Logger {
    return this.logger;
  }
}
