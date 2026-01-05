import cron from 'node-cron';
import { container } from 'tsyringe';
import { NotificationService } from './notification.service';
import { AnalyticsService } from './analytics.service';
import logger from '../config/logger';

const notificationService = container.resolve(NotificationService);
const analyticsService = container.resolve(AnalyticsService);

export class SchedulerService {
  static start() {
    // Daily tasks at 9 AM
    cron.schedule('0 9 * * *', async () => {
      logger.info('Running daily scheduled tasks');

      try {
        // Send daily production reports
        await notificationService.sendDailyProductionReports();

        // Generate daily analytics
        await analyticsService.generateDailyAnalytics();

        // Check for low inventory alerts
        await notificationService.checkLowInventoryAlerts();

        logger.info('Daily scheduled tasks completed');
      } catch (error) {
        logger.error('Error in daily scheduled tasks:', error);
      }
    });

    // Weekly tasks on Monday at 8 AM
    cron.schedule('0 8 * * 1', async () => {
      logger.info('Running weekly scheduled tasks');

      try {
        // Send weekly summary reports
        await notificationService.sendWeeklySummaryReports();

        // Generate weekly analytics
        await analyticsService.generateWeeklyAnalytics();

        logger.info('Weekly scheduled tasks completed');
      } catch (error) {
        logger.error('Error in weekly scheduled tasks:', error);
      }
    });

    // Monthly tasks on 1st of month at 7 AM
    cron.schedule('0 7 1 * *', async () => {
      logger.info('Running monthly scheduled tasks');

      try {
        // Send monthly financial reports
        await notificationService.sendMonthlyFinancialReports();

        // Generate monthly analytics
        await analyticsService.generateMonthlyAnalytics();

        logger.info('Monthly scheduled tasks completed');
      } catch (error) {
        logger.error('Error in monthly scheduled tasks:', error);
      }
    });

    logger.info('Scheduler service started');
  }
}