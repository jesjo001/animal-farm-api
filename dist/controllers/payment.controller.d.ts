import { Request, Response, NextFunction } from 'express';
export declare const initiatePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const handleWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=payment.controller.d.ts.map