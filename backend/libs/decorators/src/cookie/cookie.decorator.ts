import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

export const Cookie = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return data
      ? (request.cookies?.[data] as string)
      : (request.cookies as Record<string, string>);
  },
);
