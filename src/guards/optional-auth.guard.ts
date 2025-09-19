import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getSession } from 'supertokens-node/recipe/session';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const session = await getSession(request, response, {
        sessionRequired: false,
      });

      request.session = session;
    } catch (error) {
      return true;
    }

    return true;
  }
}
