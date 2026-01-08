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
export declare class PaymentService {
    private transactionService;
    private flutterwave;
    constructor(transactionService: TransactionService);
    initiatePayment(paymentData: PaymentData): Promise<PaymentResponse>;
    verifyPayment(transactionId: string): Promise<PaymentResponse>;
    handleWebhook(payload: any): Promise<void>;
}
//# sourceMappingURL=payment.service.d.ts.map