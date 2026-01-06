import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { container } from 'tsyringe';
import { getPaginationOptions } from '../utils/pagination.util';

const transactionService = container.resolve(TransactionService);

export const getFinancialSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('getFinancialSummary called with:', { startDate, endDate, tenantId: req.tenantId });
    
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'startDate and endDate are required' });
    }
    
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999); // Set to the end of the day
    console.log('Parsed dates:', { start, end });
    
    const summary = await transactionService.getFinancialSummary(req.tenantId!, start, end);
    console.log('Financial summary result:', summary);
    
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error in getFinancialSummary:', error);
    next(error);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const filters: any = { tenantId: req.tenantId };

    if (req.query.transactionType) filters.transactionType = req.query.transactionType;
    if (req.query.startDate) filters.date = { $gte: new Date(req.query.startDate as string) };
    if (req.query.endDate) {
      const end = new Date(req.query.endDate as string);
      end.setHours(23, 59, 59, 999);
      filters.date = { ...filters.date, $lte: end };
    }
    if (req.query.category) filters.category = req.query.category;
    if (req.query.status) filters.status = req.query.status;

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
