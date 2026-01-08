import { TransactionService } from './transaction.service';
export interface PaymentData {
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    paymentDescription: string;
    redirectUrl?: string;
    tenantId: string;
    userId: string;
    transactionType?: 'income' | 'expense';
    category?: string;
}
export interface PaymentResponse {
    success: boolean;
    data?: any;
    message?: string;
    paymentLink?: string;
}
export declare function initiatePayment(paymentData: PaymentData, transactionService: TransactionService): Promise<PaymentResponse>;
export declare function verifyPayment(transactionId: string, transactionService: TransactionService): Promise<PaymentResponse>;
export declare function handleWebhook(payload: any, transactionService: TransactionService): Promise<void>;
//# sourceMappingURL=payment.service.d.ts.map