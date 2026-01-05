import { BaseRepository } from '../repositories/BaseRepository';
import { IUser } from '../models/User.model';
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    constructor(notificationRepository: BaseRepository<any>, userRepository: BaseRepository<IUser>);
    createNotification(tenantId: string, userId: string, type: 'info' | 'warning' | 'error' | 'success', title: string, message: string, relatedEntity?: {
        type: 'animal' | 'production' | 'event' | 'transaction' | 'feed';
        id: string;
    }): Promise<any>;
    getUserNotifications(userId: string, tenantId: string, limit?: number): Promise<any[]>;
    markAsRead(notificationId: string, userId: string, tenantId: string): Promise<any>;
    markAllAsRead(userId: string, tenantId: string): Promise<void>;
    getUnreadCount(userId: string, tenantId: string): Promise<number>;
    sendLowFeedStockAlert(tenantId: string, feedType: string, currentQuantity: number): Promise<void>;
    sendMortalityAlert(tenantId: string, animalId: string, animalTag: string): Promise<void>;
    sendProductionMilestoneAlert(tenantId: string, totalEggs: number, date: Date): Promise<void>;
    sendDailyProductionReports(): Promise<void>;
    checkLowInventoryAlerts(): Promise<void>;
    sendWeeklySummaryReports(): Promise<void>;
    sendMonthlyFinancialReports(): Promise<void>;
}
//# sourceMappingURL=notification.service.d.ts.map