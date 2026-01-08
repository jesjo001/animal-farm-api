import { singleton } from 'tsyringe';
import Flutterwave from 'flutterwave-node-v3';
import { TransactionService } from './transaction.service';
import { env } from '../config/env';

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

@singleton()
export class PaymentService {
  private flutterwave: Flutterwave;

  constructor(private transactionService: TransactionService) {
    this.flutterwave = new Flutterwave(
      env.FLUTTERWAVE_PUBLIC_KEY,
      env.FLUTTERWAVE_SECRET_KEY
    );
  }

  async initiatePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const payload = {
        tx_ref: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: paymentData.amount,
        currency: paymentData.currency || 'NGN',
        redirect_url: paymentData.redirectUrl || `${env.FRONTEND_URL}/payment/callback`,
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: paymentData.customerEmail,
          phonenumber: paymentData.customerPhone || '',
          name: paymentData.customerName,
        },
        customizations: {
          title: 'FarmFlow Payment',
          description: paymentData.paymentDescription,
          logo: 'https://your-logo-url.com/logo.png', // Replace with actual logo URL
        },
      };

      const response = await this.flutterwave.Payment.create(payload);

      if (response.status === 'success') {
        // Create transaction record
        const transactionData = {
          transactionType: paymentData.transactionType || 'income',
          amount: paymentData.amount,
          date: new Date(),
          category: paymentData.category || 'Payment',
          description: paymentData.paymentDescription,
          paymentMethod: 'flutterwave' as const,
          paymentStatus: 'pending' as const,
          paymentReference: payload.tx_ref,
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
        };

        await this.transactionService.createTransaction(
          transactionData,
          paymentData.tenantId,
          paymentData.userId
        );

        return {
          success: true,
          data: response.data,
          paymentLink: response.data.link,
          message: 'Payment initiated successfully',
        };
      } else {
        return {
          success: false,
          message: response.message || 'Payment initiation failed',
        };
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      return {
        success: false,
        message: 'An error occurred while initiating payment',
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await this.flutterwave.Transaction.verify({ id: transactionId });

      if (response.status === 'success' && response.data.status === 'successful') {
        // Update transaction status
        await this.transactionService.updateTransaction(
          response.data.tx_ref.split('_')[2], // Extract transaction ID from tx_ref
          {
            paymentStatus: 'completed',
            paymentId: transactionId,
          },
          '', // tenantId will be handled in controller
          '' // userId will be handled in controller
        );

        return {
          success: true,
          data: response.data,
          message: 'Payment verified successfully',
        };
      } else {
        // Update transaction status to failed
        await this.transactionService.updateTransaction(
          response.data.tx_ref.split('_')[2],
          { paymentStatus: 'failed' },
          '',
          ''
        );

        return {
          success: false,
          message: 'Payment verification failed',
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        message: 'An error occurred while verifying payment',
      };
    }
  }

  async handleWebhook(payload: any): Promise<void> {
    try {
      // Verify webhook signature (implement based on Flutterwave docs)
      const secretHash = env.FLUTTERWAVE_SECRET_HASH;
      // Add signature verification logic here

      const { event, data } = payload;

      if (event === 'charge.completed' && data.status === 'successful') {
        // Update transaction status
        await this.transactionService.updateTransaction(
          data.tx_ref.split('_')[2],
          {
            paymentStatus: 'completed',
            paymentId: data.id.toString(),
          },
          '', // tenantId
          '' // userId
        );
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
    }
  }
}