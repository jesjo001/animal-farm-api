import { singleton, inject } from 'tsyringe';
import { AnimalService } from './animal.service';
import { ProductionService } from './production.service';
import { EventService } from './event.service';
import { TransactionService } from './transaction.service';

@singleton()
export class AnalyticsService {
  constructor(
    @inject(AnimalService) private animalService: AnimalService,
    @inject(ProductionService) private productionService: ProductionService,
    @inject(EventService) private eventService: EventService,
    @inject(TransactionService) private transactionService: TransactionService
  ) {}

  async getKPIs(tenantId: string): Promise<any> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const [
      animalStats,
      currentMonthProduction,
      lastMonthProduction,
      currentMonthRevenue,
      lastMonthRevenue,
      mortalityRate,
      currentYearRevenue,
      currentYearExpenses,
    ] = await Promise.all([
      this.animalService.getAnimalStats(tenantId),
      this.productionService.getTotalEggs(tenantId, startOfMonth, now),
      this.productionService.getTotalEggs(tenantId, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1), startOfMonth),
      this.transactionService.getTotalIncome(tenantId, startOfMonth, now),
      this.transactionService.getTotalIncome(tenantId, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1), startOfMonth),
      this.eventService.getMortalityRate(tenantId, 'monthly'),
      this.transactionService.getTotalIncome(tenantId, startOfYear, now),
      this.transactionService.getTotalExpenses(tenantId, startOfYear, now),
    ]);

    const revenueGrowth = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
      : 0;

    const productionGrowth = lastMonthProduction > 0
      ? ((currentMonthProduction - lastMonthProduction) / lastMonthProduction * 100)
      : 0;

    return {
      totalAnimals: animalStats.total,
      healthyAnimals: animalStats.healthy,
      sickAnimals: animalStats.sick,
      animalHealthRate: animalStats.healthyPercentage,
      monthlyEggProduction: {
        current: currentMonthProduction,
        growth: productionGrowth.toFixed(2),
      },
      monthlyRevenue: {
        current: currentMonthRevenue,
        growth: revenueGrowth.toFixed(2),
      },
      mortalityRate: mortalityRate.mortalityRate,
      yearlyProfit: currentYearRevenue - currentYearExpenses,
    };
  }

  async getProductionTrends(tenantId: string, days: number = 30): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.productionService.getProductionChart(tenantId, startDate, endDate);
  }

  async getFinancialTrends(tenantId: string, months: number = 12): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return this.transactionService.getProfitLossReport(tenantId, startDate, endDate);
  }

  async getEventTrends(tenantId: string, days: number = 30): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.eventService.getEventStats(tenantId, startDate, endDate);
  }

  async getDashboardData(tenantId: string): Promise<any> {
    const [kpis, recentProduction, recentTransactions, recentEvents] = await Promise.all([
      this.getKPIs(tenantId),
      this.productionService.getProductions({ tenantId }, { page: 1, limit: 5 }),
      this.transactionService.getTransactions({ tenantId }, { page: 1, limit: 5 }),
      this.eventService.getEvents({ tenantId }, { page: 1, limit: 5 }),
    ]);

    return {
      kpis,
      recentActivity: {
        production: recentProduction.data,
        transactions: recentTransactions.data,
        events: recentEvents.data,
      },
    };
  }
}