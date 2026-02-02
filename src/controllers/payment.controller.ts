import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { initiatePayment as initiatePaymentFunction, verifyPayment as verifyPaymentFunction, handleWebhook as handleWebhookFunction } from '../services/payment.service';
import { TransactionService } from '../services/transaction.service';
import { PaymentData } from '../types';
import { UnauthorizedError } from '../utils/errors';
import { env } from '../config/env';

const transactionService = container.resolve(TransactionService);

export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentData: PaymentData = {
      ...req.body,
      tenantId: req.tenantId!,
      userId: req.user!.id,
    };

    const result = await initiatePaymentFunction(paymentData, transactionService);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId } = req.params;
    const result = await verifyPaymentFunction(transactionId, transactionService);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['verif-hash'];
    const signatureValue = Array.isArray(signature) ? signature[0] : signature;

    if (!signatureValue || signatureValue !== env.FLUTTERWAVE_SECRET_HASH) {
      throw new UnauthorizedError('Invalid webhook signature');
    }

    await handleWebhookFunction(req.body, transactionService);
    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    next(error);
  }
};