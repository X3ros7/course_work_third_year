import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map, Observable } from 'rxjs';

interface Response<T> {
  data: T;
  code: number;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        message:
          statusCode === 201
            ? 'Item created successfully'
            : 'Data retrieved successfully',
        code: statusCode,
        data: data.data ?? data,
        meta: data.meta ? data.meta : undefined,
      })),
    );
  }
}
