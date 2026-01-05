import { singleton, inject } from 'tsyringe';
import { BaseRepository } from '../repositories/BaseRepository';
import { IUser } from '../models/User.model';

@singleton()
export class NotificationService {
  constructor(
    @inject('NotificationRepository') private notificationRepository: BaseRepository<any>,
    @inject('UserRepository') private userRepository: BaseRepository<IUser>
  ) {}

  async createNotification(
    tenantId: string,
    userId: string,
    type: 'info' | 'warning' | 'error' | 'success',
    title: string,
    message: string,
    relatedEntity?: { type: 'animal' | 'production' | 'event' | 'transaction' | 'feed'; id: string }
  ): Promise<any> {
    return this.notificationRepository.create({
      tenantId,
      userId,
      type,
      title,
      message,
      relatedEntity,
    });
  }

  async getUserNotifications(userId: string, tenantId: string, limit: number = 50): Promise<any[]> {
    return this.notificationRepository.find(
      { tenantId, userId },
      { limit, sort: { createdAt: -1 } }
    );
  }

  async markAsRead(notificationId: string, userId: string, tenantId: string): Promise<any> {
    return this.notificationRepository.updateById(notificationId, { isRead: true });
  }

  async markAllAsRead(userId: string, tenantId: string): Promise<void> {
    await this.notificationRepository.updateMany(
      { tenantId, userId, isRead: false },
      { isRead: true }
    );
  }

  async getUnreadCount(userId: string, tenantId: string): Promise<number> {
    return this.notificationRepository.count({ tenantId, userId, isRead: false });
  }

  async sendLowFeedStockAlert(tenantId: string, feedType: string, currentQuantity: number): Promise<void> {
    // Get all users in the tenant
    const users = await this.userRepository.find({ tenantId });

    const notifications = users.map(user =>
      this.createNotification(
        tenantId,
        user._id.toString(),
        'warning',
        'Low Feed Stock Alert',
        `Feed type "${feedType}" is running low. Current quantity: ${currentQuantity}`,
        { type: 'feed', id: feedType }
      )
    );

    await Promise.all(notifications);
  }

  async sendMortalityAlert(tenantId: string, animalId: string, animalTag: string): Promise<void> {
    const users = await this.userRepository.find({ tenantId });

    const notifications = users.map(user =>
      this.createNotification(
        tenantId,
        user._id.toString(),
        'error',
        'Animal Mortality',
        `Animal with tag "${animalTag}" has been marked as deceased.`,
        { type: 'animal', id: animalId }
      )
    );

    await Promise.all(notifications);
  }

  async sendProductionMilestoneAlert(tenantId: string, totalEggs: number, date: Date): Promise<void> {
    const users = await this.userRepository.find({ tenantId });

    const notifications = users.map(user =>
      this.createNotification(
        tenantId,
        user._id.toString(),
        'success',
        'Production Milestone',
        `Congratulations! ${totalEggs} eggs were collected on ${date.toDateString()}.`,
        { type: 'production', id: date.toISOString() }
      )
    );

    await Promise.all(notifications);
  }
}