import { Request, Response, NextFunction } from 'express';
export declare const createTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTenant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTenantProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTenantProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateSubscriptionPlan: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tenant.controller.d.ts.map