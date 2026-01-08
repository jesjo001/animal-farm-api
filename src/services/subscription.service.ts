import { singleton, inject } from 'tsyringe';
import mongoose from 'mongoose';
import { TransactionService } from './transaction.service';
import { AuditService } from './audit.service';

export interface SubscriptionData {
  plan: 'free' | 'basic' | 'pro' | 'business';
  amount: number;
  tenantId: string;
  userId: string;
  paymentReference: string;
}

@singleton()
export class SubscriptionService {
  constructor(
    @inject(TransactionService) private transactionService: TransactionService,
    @inject(AuditService) private auditService: AuditService
  ) {}

  async createSubscription(subscriptionData: SubscriptionData): Promise<any> {
    const { plan, amount, tenantId, userId, paymentReference } = subscriptionData;

    // Create subscription transaction
    const transactionData = {
      transactionType: 'income' as const,
      amount,
      date: new Date(),
      category: 'Subscription',
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
      paymentMethod: 'flutterwave' as const,
      paymentStatus: 'completed' as const,
      paymentReference,
    };

    const transaction = await this.transactionService.createTransaction(
      transactionData,
      tenantId,
      userId
    );

    // TODO: Update tenant subscription plan in database
    // This would typically update a subscription field in the tenant model

    // Create audit log
    await this.auditService.logActivity(
      tenantId,
      userId,
      'create',
      'subscription',
      transaction._id.toString(),
      undefined,
      { plan, amount }
    );

    return {
      success: true,
      transaction,
      plan,
    };
  }

  getPlanDetails(plan: string) {
    const plans = {
      free: { price: 0, name: 'Free Plan' },
      basic: { price: 10, name: 'Basic Plan' },
      pro: { price: 25, name: 'Pro Plan' },
      business: { price: 99, name: 'Business Plan' },
    };

    return plans[plan as keyof typeof plans] || null;
  }
}