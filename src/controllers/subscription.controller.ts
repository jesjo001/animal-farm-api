import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { SubscriptionService } from '../services/subscription.service';

const subscriptionService = container.resolve(SubscriptionService);

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptionData = {
      plan: req.body.plan,
      amount: req.body.amount,
      tenantId: req.tenantId!,
      userId: req.user!.id,
      paymentReference: req.body.paymentReference,
    };

    const result = await subscriptionService.createSubscription(subscriptionData);

    if (result.success) {
      res.status(201).json({ success: true, data: result });
    } else {
      res.status(400).json({ success: false, message: 'Failed to create subscription' });
    }
  } catch (error) {
    next(error);
  }
};