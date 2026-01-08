import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { PaymentService } from '../services/payment.service';
import { PaymentData } from '../types';

const paymentService = container.resolve(PaymentService);

export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentData: PaymentData = {
      ...req.body,
      tenantId: req.tenantId!,
      userId: req.user!.id,
    };

    const result = await paymentService.initiatePayment(paymentData);

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
    const result = await paymentService.verifyPayment(transactionId);

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
    await paymentService.handleWebhook(req.body);
    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    next(error);
  }
};