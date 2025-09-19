import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof NotFoundException) {
      status = 404;
      message = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      status = 401;
      message = exception.message;
    } else if (exception instanceof GraphQLError) {
      message = exception.message;
      status = 400;
    }

    return new GraphQLError(message, {
      extensions: {
        code: this.getGraphQLCode(status),
        statusCode: status,
      },
    });
  }

  private getGraphQLCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHENTICATED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      default:
        return 'INTERNAL_ERROR';
    }
  }
}
