import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ServerCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query } = request;

    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.generateCacheKey(url, query);

    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      console.log(`Got from cache for key: ${cacheKey}`);
      return of(cachedResponse);
    }

    console.log(`Miss cached value for key: ${cacheKey}`);

    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(cacheKey, response);
      }),
    );
  }

  private generateCacheKey(url: string, query: any): string {
    const queryString = new URLSearchParams(query).toString();
    return `${url}${queryString ? `?${queryString}` : ''}`;
  }
}
