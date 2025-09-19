import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';

@Catch()
export class MvcExceptionFilter implements ExceptionFilter {
  constructor(private readonly notificationService: NotificationService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

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
    }

    const errorUrl = `/error?code=${status}&message=${encodeURIComponent(message)}`;
    this.notificationService.error('', `Ошибка ${status}`, message);
    response.redirect(errorUrl);
  }
}
