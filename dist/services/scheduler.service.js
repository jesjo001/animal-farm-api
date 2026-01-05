"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const tsyringe_1 = require("tsyringe");
const notification_service_1 = require("./notification.service");
const analytics_service_1 = require("./analytics.service");
const logger_1 = __importDefault(require("../config/logger"));
const notificationService = tsyringe_1.container.resolve(notification_service_1.NotificationService);
const analyticsService = tsyringe_1.container.resolve(analytics_service_1.AnalyticsService);
class SchedulerService {
    static start() {
        // Daily tasks at 9 AM
        node_cron_1.default.schedule('0 9 * * *', async () => {
            logger_1.default.info('Running daily scheduled tasks');
            try {
                // Send daily production reports
                await notificationService.sendDailyProductionReports();
                // Generate daily analytics
                await analyticsService.generateDailyAnalytics();
                // Check for low inventory alerts
                await notificationService.checkLowInventoryAlerts();
                logger_1.default.info('Daily scheduled tasks completed');
            }
            catch (error) {
                logger_1.default.error('Error in daily scheduled tasks:', error);
            }
        });
        // Weekly tasks on Monday at 8 AM
        node_cron_1.default.schedule('0 8 * * 1', async () => {
            logger_1.default.info('Running weekly scheduled tasks');
            try {
                // Send weekly summary reports
                await notificationService.sendWeeklySummaryReports();
                // Generate weekly analytics
                await analyticsService.generateWeeklyAnalytics();
                logger_1.default.info('Weekly scheduled tasks completed');
            }
            catch (error) {
                logger_1.default.error('Error in weekly scheduled tasks:', error);
            }
        });
        // Monthly tasks on 1st of month at 7 AM
        node_cron_1.default.schedule('0 7 1 * *', async () => {
            logger_1.default.info('Running monthly scheduled tasks');
            try {
                // Send monthly financial reports
                await notificationService.sendMonthlyFinancialReports();
                // Generate monthly analytics
                await analyticsService.generateMonthlyAnalytics();
                logger_1.default.info('Monthly scheduled tasks completed');
            }
            catch (error) {
                logger_1.default.error('Error in monthly scheduled tasks:', error);
            }
        });
        logger_1.default.info('Scheduler service started');
    }
}
exports.SchedulerService = SchedulerService;
//# sourceMappingURL=scheduler.service.js.map