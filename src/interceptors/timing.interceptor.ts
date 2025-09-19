import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    let request = context.switchToHttp().getRequest<Request>();
    let response = context.switchToHttp().getResponse<Response>();

    if (!request) {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
      response = gqlContext.getContext().res;
    }

    if (response && !response.headersSent) {
      response.on('finish', () => {
        const elapsedTime = Date.now() - startTime;
        console.log(
          `${request?.method || 'GraphQL'} ${request?.baseUrl || ''}${request?.url || ''} - ${elapsedTime}ms`,
        );
      });
    }

    return next.handle().pipe(
      tap((data) => {
        const elapsedTime = Date.now() - startTime;

        if (
          this.isRenderRequest(request, data) &&
          typeof data === 'object' &&
          data !== null
        ) {
          data.serverElapsedTime = elapsedTime;
        }
      }),
    );
  }

  private isRenderRequest(request: Request, data: any): boolean {
    if (!request) return false;
    const acceptHeader = request.headers.accept || '';
    return (
      acceptHeader.includes('text/html') &&
      typeof data === 'object' &&
      data !== null
    );
  }
}
