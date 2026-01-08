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

  async getFinancialTrends(tenantId: string, startDate: Date, endDate: Date): Promise<any[]> {
    return this.transactionService.getProfitLossReport(tenantId, startDate, endDate);
  }

  async getFinancialSummary(tenantId: string, startDate: Date, endDate: Date): Promise<any> {
    const [summary, trends] = await Promise.all([
        this.transactionService.getFinancialSummary(tenantId, startDate, endDate),
        this.getFinancialTrends(tenantId, startDate, endDate)
    ]);

    return {
        summary,
        trends
    };
  }

  async getComprehensiveAnalytics(tenantId: string, days: number): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);

    const [
        // Current period data
        revenue,
        expenses,
        eggCount,
        newAnimals,
        animalStats,
        mortalityRate,
        // Previous period data
        prevRevenue,
        prevExpenses,
        prevEggCount,
        prevNewAnimals,
        // Chart data
        productionTrends,
        financialTrends,
        revenueDistribution,
    ] = await Promise.all([
        this.transactionService.getTotalIncome(tenantId, startDate, endDate),
        this.transactionService.getTotalExpenses(tenantId, startDate, endDate),
        this.productionService.getTotalEggs(tenantId, startDate, endDate),
        this.animalService.count({ tenantId, createdAt: { $gte: startDate, $lte: endDate } }),
        this.animalService.getAnimalStats(tenantId),
        this.eventService.getMortalityRate(tenantId, 'monthly'), // Assuming monthly is ok for this KPI
        this.transactionService.getTotalIncome(tenantId, prevStartDate, prevEndDate),
        this.transactionService.getTotalExpenses(tenantId, prevStartDate, prevEndDate),
        this.productionService.getTotalEggs(tenantId, prevStartDate, prevEndDate),
        this.animalService.count({ tenantId, createdAt: { $gte: prevStartDate, $lte: prevEndDate } }),
        this.getProductionTrends(tenantId, days),
        this.getFinancialTrends(tenantId, startDate, endDate),
        this.transactionService.getFinancialSummary(tenantId, startDate, endDate),
    ]);

    // Calculate KPIs
    const productionEfficiency = (animalStats.total > 0 && days > 0) ? (eggCount / (animalStats.total * days)) * 100 : 0;
    const revenuePerAnimal = animalStats.total > 0 ? revenue / animalStats.total : 0;

    // Assemble response
    return {
        kpis: {
            productionEfficiency,
            revenuePerAnimal,
            mortalityRate: mortalityRate.mortalityRate,
            feedConversion: 1.85, // Placeholder
        },
        productionTrends,
        financialTrends,
        revenueDistribution: revenueDistribution.summary,
        comparison: {
            thisMonth: {
                revenue,
                expenses,
                newAnimals,
                eggsCollected: eggCount
            },
            lastMonth: {
                revenue: prevRevenue,
                expenses: prevExpenses,
                newAnimals: prevNewAnimals,
                eggsCollected: prevEggCount
            }
        }
    };
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

    const mapId = (item: any) => ({ ...item.toObject(), id: item._id.toString() });

    return {
      kpis,
      recentActivity: {
        production: recentProduction.data.map(mapId),
        transactions: recentTransactions.data.map(mapId),
        events: recentEvents.data.map(mapId),
      },
    };
  }

  // Scheduled task methods
  async generateDailyAnalytics(): Promise<void> {
    // Implementation for generating daily analytics reports
    console.log('Generating daily analytics...');
  }

  async generateWeeklyAnalytics(): Promise<void> {
    // Implementation for generating weekly analytics reports
    console.log('Generating weekly analytics...');
  }

  async generateMonthlyAnalytics(): Promise<void> {
    // Implementation for generating monthly analytics reports
    console.log('Generating monthly analytics...');
  }
}
