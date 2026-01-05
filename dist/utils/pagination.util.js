"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResponse = exports.getPaginationOptions = void 0;
const getPaginationOptions = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
    return { page, limit };
};
exports.getPaginationOptions = getPaginationOptions;
const createPaginatedResponse = (data, total, options) => {
    const { page, limit } = options;
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
//# sourceMappingURL=pagination.util.js.map