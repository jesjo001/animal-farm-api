import { Request, Response, NextFunction } from 'express';
export declare class ChickSexingController {
    static analyzeSingle(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static analyzeBatch(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getSexingStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSexingBatches(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=sexing.controller.d.ts.map