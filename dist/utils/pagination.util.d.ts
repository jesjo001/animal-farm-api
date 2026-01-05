import { PaginationOptions, PaginatedResponse } from '../types';
export declare const getPaginationOptions: (query: any) => PaginationOptions;
export declare const createPaginatedResponse: <T>(data: T[], total: number, options: PaginationOptions) => PaginatedResponse<T>;
//# sourceMappingURL=pagination.util.d.ts.map