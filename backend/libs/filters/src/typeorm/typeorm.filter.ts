import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'DATABASE_ERROR';

    // Handle specific TypeORM errors with appropriate HTTP statuses and messages
    if (exception instanceof QueryFailedError) {
      const err = exception as any;

      // Duplicate entry error (PostgreSQL)
      if (err.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry found';
        code = 'DUPLICATE_ENTRY';
      }

      // Foreign key constraint error (PostgreSQL)
      else if (err.code === '23503') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint violation';
        code = 'FOREIGN_KEY_VIOLATION';
      }

      // MySQL-specific error codes
      else if (err.code === 'ER_DUP_ENTRY') {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry found';
        code = 'DUPLICATE_ENTRY';
      }

      // Default query failed error
      else {
        status = HttpStatus.BAD_REQUEST;
        message = err.message || 'Query execution failed';
        code = 'QUERY_FAILED';
      }
    }

    // Handle entity not found error
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message || 'Entity not found';
      code = 'ENTITY_NOT_FOUND';
    }

    // Response format
    response.status(status).json({
      statusCode: status,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
