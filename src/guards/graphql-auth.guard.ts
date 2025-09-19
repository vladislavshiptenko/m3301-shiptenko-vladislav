import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getSession } from 'supertokens-node/recipe/session';

@Injectable()
export class GraphQLAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext();

    try {
      const session = await getSession(req, res, {
        sessionRequired: true,
      });

      req.session = session;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Session invalid');
    }
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies = {};

    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach((cookie) => {
      const trimmed = cookie.trim();
      const equalIndex = trimmed.indexOf('=');

      if (equalIndex > 0) {
        const name = trimmed.substring(0, equalIndex).trim();
        const value = trimmed.substring(equalIndex + 1).trim();

        try {
          cookies[name] = decodeURIComponent(value);
        } catch (e) {
          cookies[name] = value;
        }
      }
    });

    return cookies;
  }
}
