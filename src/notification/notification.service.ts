import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface NotificationData {
  id?: string;
  type: string;
  messageType: string;
  module: string;
  action: string;
  title: string;
  message: string;
  data?: any;
  userId?: string;
  timestamp: string;
}

@Injectable()
export class NotificationService {
  private notificationSubject = new Subject<NotificationData>();

  getNotificationStream() {
    return this.notificationSubject.asObservable();
  }

  send(notification: Omit<NotificationData, 'timestamp' | 'id'>) {
    const fullNotification: NotificationData = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    console.log('Send event:', fullNotification);
    this.notificationSubject.next(fullNotification);
  }

  created(module: string, title: string, data?: any, userId?: string) {
    this.send({
      type: 'message',
      messageType: 'success',
      module,
      action: 'create',
      title: `${title} создан`,
      message: `Новый объект "${title}" был успешно создан`,
      data,
      userId,
    });
  }

  updated(module: string, title: string, data?: any, userId?: string) {
    this.send({
      type: 'message',
      messageType: 'info',
      module,
      action: 'update',
      title: `${title} обновлен`,
      message: `Объект '${title}' был обновлен`,
      data,
      userId,
    });
  }

  deleted(module: string, title: string, data?: any, userId?: string) {
    this.send({
      type: 'message',
      messageType: 'warning',
      module,
      action: 'delete',
      title: `${title} удален`,
      message: `Объект '${title}' был удален`,
      data,
      userId,
    });
  }

  error(module: string, title: string, error: string, userId?: string) {
    this.send({
      type: 'message',
      messageType: 'error',
      module,
      action: 'message',
      title: `Ошибка в ${module}`,
      message: `${title}: ${error}`,
      userId,
    });
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
