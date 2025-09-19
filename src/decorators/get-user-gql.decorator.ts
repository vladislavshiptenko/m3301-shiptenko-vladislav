import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserGQL = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (!req.session) {
      return null;
    }

    const userId = req.session.getUserId();
    const payload = req.session.getAccessTokenPayload();

    const user = {
      id: userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    return data ? user[data] : user;
  },
);
