import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const session: SessionContainer = request.session;

    if (!session) {
      return null;
    }

    const userId = session.getUserId();
    const payload = session.getAccessTokenPayload();

    const user = {
      id: userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    return data ? user[data] : user;
  },
);
