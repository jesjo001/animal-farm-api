"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransaction = exports.createTransaction = exports.getTransactions = void 0;
const transaction_service_1 = require("../services/transaction.service");
const tsyringe_1 = require("tsyringe");
const pagination_util_1 = require("../utils/pagination.util");
const transactionService = tsyringe_1.container.resolve(transaction_service_1.TransactionService);
const getTransactions = async (req, res, next) => {
    try {
        const options = (0, pagination_util_1.getPaginationOptions)(req.query);
        const filters = { tenantId: req.tenantId };
        if (req.query.transactionType)
            filters.transactionType = req.query.transactionType;
        if (req.query.startDate)
            filters.date = { $gte: new Date(req.query.startDate) };
        if (req.query.endDate)
            filters.date = { ...filters.date, $lte: new Date(req.query.endDate) };
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