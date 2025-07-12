import { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.ENVIRONMENT === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname,req,res',
              messageFormat: '{req.method} {req.url} - {msg}',
              levelFirst: true,
            },
          }
        : undefined,

    // Кастомизация логирования HTTP запросов
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },

    // Кастомизация сообщений успешных запросов
    customSuccessMessage: function (req, res) {
      return `${req.method} ${req.url} completed`;
    },

    // Кастомизация сообщений ошибок
    customErrorMessage: function (req, res, err) {
      return `${req.method} ${req.url} failed with error: ${err.message}`;
    },

    // Дополнительные поля для логирования
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'duration',
    },

    // Сериализация запросов и ответов
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: {
          'user-agent': req.headers['user-agent'],
          'content-type': req.headers['content-type'],
          'x-forwarded-for': req.headers['x-forwarded-for'],
        },
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: {
          'content-type': res.getHeader('content-type'),
          'content-length': res.getHeader('content-length'),
        },
      }),
      err: (err) => ({
        type: err.constructor.name,
        message: err.message,
        stack: err.stack,
      }),
    },
  },
};
