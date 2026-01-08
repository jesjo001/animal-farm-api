import { Request, Response, NextFunction } from 'express';
type Feature = 'animals' | 'users' | 'analytics';
export declare const checkPlanEnforcement: (feature: Feature) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=planEnforcement.middleware.d.ts.map