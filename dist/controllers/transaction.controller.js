"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransaction = exports.createTransaction = exports.getTransactions = exports.getFinancialSummary = void 0;
const transaction_service_1 = require("../services/transaction.service");
const tsyringe_1 = require("tsyringe");
const pagination_util_1 = require("../utils/pagination.util");
const transactionService = tsyringe_1.container.resolve(transaction_service_1.TransactionService);
const getFinancialSummary = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        console.log('getFinancialSummary called with:', { startDate, endDate, tenantId: req.tenantId });
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'startDate and endDate are required' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to the end of the day
        console.log('Parsed dates:', { start, end });
        const summary = await transactionService.getFinancialSummary(req.tenantId, start, end);
        console.log('Financial summary result:', summary);
        res.json({ success: true, data: summary });
    }
    catch (error) {
        console.error('Error in getFinancialSummary:', error);
        next(error);
    }
};
exports.getFinancialSummary = getFinancialSummary;
const getTransactions = async (req, res, next) => {
    try {
        const options = (0, pagination_util_1.getPaginationOptions)(req.query);
        const filters = { tenantId: req.tenantId };
        if (req.query.transactionType)
            filters.transactionType = req.query.transactionType;
        if (req.query.startDate)
            filters.date = { $gte: new Date(req.query.startDate) };
        if (req.query.endDate) {
            const end = new Date(req.query.endDate);
            end.setHours(23, 59, 59, 999);
            filters.date = { ...filters.date, $lte: end };
        }
        if (req.query.category)
            filters.category = req.query.category;
        if (req.query.status)
            filters.status = req.query.status;
        const transactions = await transactionService.getTransactions(filters, options);
        res.json({ success: true, data: transactions });
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactions = getTransactions;
const createTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.createTransaction(req.body, req.tenantId, req.user.id);
        res.status(201).json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
};
exports.createTransaction = createTransaction;
const getTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.id, req.tenantId);
        res.json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
};
exports.getTransaction = getTransaction;
const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.updateTransaction(req.params.id, req.body, req.tenantId, req.user.id);
        res.json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res, next) => {
    try {
        await transactionService.deleteTransaction(req.params.id, req.tenantId, req.user.id);
        res.json({ success: true, message: 'Transaction deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=transaction.controller.js.map