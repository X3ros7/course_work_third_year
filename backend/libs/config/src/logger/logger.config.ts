import { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      targets: [
        // Loki
        {
          target: 'pino-loki',
          options: {
            host: process.env.LOKI_HOST || 'http://localhost:3100',
            batching: false,
            interval: 5000,
            silenceErrors: false,
            labels: {
              app: 'nestjs-app',
              environment: process.env.ENVIRONMENT || 'development',
              service: 'backend',
              version: process.env.APP_VERSION || '1.0.0',
            },
          },
          level: process.env.LOG_LEVEL || 'info',
        },
        // Красивый вывод для dev
        ...(process.env.ENVIRONMENT === 'development'
          ? [
              {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname,req,res',
                  messageFormat: '{req.method} {req.url} - {msg}',
                  levelFirst: true,
                },
                level: 'debug',
              },
            ]
          : []),
      ],
    },
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    customSuccessMessage: function (req, res) {
      return `${req.method} ${req.url} completed`;
    },
    customErrorMessage: function (req, res, err) {
      return `${req.method} ${req.url} failed with error: ${err.message}`;
    },
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'duration',
    },
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
          'content-type':
            typeof res.getHeader === 'function'
              ? res.getHeader('content-type')
              : undefined,
          'content-length':
            typeof res.getHeader === 'function'
              ? res.getHeader('content-length')
              : undefined,
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
