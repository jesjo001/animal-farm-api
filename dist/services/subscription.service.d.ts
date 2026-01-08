import { TransactionService } from './transaction.service';
import { AuditService } from './audit.service';
export interface SubscriptionData {
    plan: 'free' | 'basic' | 'pro' | 'business';
    amount: number;
    tenantId: string;
    userId: string;
    paymentReference: string;
}
export declare class SubscriptionService {
    private transactionService;
    private auditService;
    constructor(transactionService: TransactionService, auditService: AuditService);
    createSubscription(subscriptionData: SubscriptionData): Promise<any>;
    getPlanDetails(plan: string): {
        price: number;
        name: string;
    } | {
        price: number;
        name: string;
    } | {
        price: number;
        name: string;
    } | {
        price: number;
        name: string;
    };
}
//# sourceMappingURL=subscription.service.d.ts.map