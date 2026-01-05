import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { container } from 'tsyringe';
import { getPaginationOptions } from '../utils/pagination.util';

const transactionService = container.resolve(TransactionService);

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const filters: any = { tenantId: req.tenantId };

    if (req.query.transactionType) filters.transactionType = req.query.transactionType;
    if (req.query.startDate) filters.date = { $gte: new Date(req.query.startDate as string) };
    if (req.query.endDate) filters.date = { ...filters.date, $lte: new Date(req.query.endDate as string) };

    const transactions = await transactionService.getTransactions(filters, options);
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.createTransaction(req.body, req.tenantId!, req.user!.id);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id, req.tenantId!);
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body, req.tenantId!, req.user!.id);
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.tenantId!, req.user!.id);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};