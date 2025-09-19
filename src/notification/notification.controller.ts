import { Controller, Sse, MessageEvent, Query } from '@nestjs/common';
import { Observable, interval, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { NotificationService, NotificationData } from './notification.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('stream')
  getNotifications(
    @Query('modules') modules?: string,
    @Query('userId') userId?: string,
  ): Observable<MessageEvent> {
    const allowedModules = modules ? modules.split(',') : [];

    const notifications$ = this.notificationService
      .getNotificationStream()
      .pipe(
        filter((notification: NotificationData) => {
          if (
            allowedModules.length > 0 &&
            !allowedModules.includes(notification.module)
          ) {
            return false;
          }

          if (userId && notification.userId && notification.userId !== userId) {
            return false;
          }

          return true;
        }),
        map(
          (notification: NotificationData): MessageEvent => ({
            data: notification,
            type: notification.type,
            id: notification.id,
          }),
        ),
      );

    const heartbeat$ = interval(30000).pipe(
      map(
        (): MessageEvent => ({
          data: {
            type: 'heartbeat',
            module: 'system',
            action: 'ping',
            title: 'Heartbeat',
            message: 'Connection alive',
            timestamp: new Date().toISOString(),
          },
          type: 'heartbeat',
          id: `heartbeat_${Date.now()}`,
        }),
      ),
    );

    const welcome$ = new Observable<MessageEvent>((observer) => {
      observer.next({
        data: {
          type: 'info',
          module: 'system',
          action: 'connect',
          title: 'Подключение установлено',
          message: `Подписка на уведомления: ${allowedModules.length ? allowedModules.join(', ') : 'все модули'}`,
          timestamp: new Date().toISOString(),
          data: { modules: allowedModules, userId },
        },
        type: 'connected',
        id: `welcome_${Date.now()}`,
      });
      observer.complete();
    });

    return merge(welcome$, notifications$, heartbeat$);
  }
}
