import { PaginationOptions, PaginatedResponse } from '../types';

export const getPaginationOptions = (query: any): PaginationOptions => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
  return { page, limit };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResponse<T> => {
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