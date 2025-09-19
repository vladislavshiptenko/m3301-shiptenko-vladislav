import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
import * as crypto from 'crypto';
import {
  CACHE_CONTROL_KEY,
  CacheControlOptions,
} from '../decorators/cache-control.decorator';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const cacheControlOptions = this.reflector.get<CacheControlOptions>(
      CACHE_CONTROL_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          const etag = this.generateETag(data);

          const ifNoneMatch = request.headers['if-none-match'];

          if (ifNoneMatch === etag) {
            response.status(304);
            return;
          }

          response.setHeader('ETag', etag);

          if (cacheControlOptions) {
            const cacheControlValue =
              this.buildCacheControlHeader(cacheControlOptions);
            response.setHeader('Cache-Control', cacheControlValue);
          }
        }

        return data;
      }),
    );
  }

  private generateETag(data: any): string {
    const content = JSON.stringify(data);
    return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
  }

  private buildCacheControlHeader(options: CacheControlOptions): string {
    const directives: string[] = [];

    if (options.public) directives.push('public');
    if (options.private) directives.push('private');
    if (options.noCache) directives.push('no-cache');
    if (options.noStore) directives.push('no-store');
    if (options.mustRevalidate) directives.push('must-revalidate');
    if (options.maxAge !== undefined)
      directives.push(`max-age=${options.maxAge}`);

    return directives.join(', ');
  }
}
