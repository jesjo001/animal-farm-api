import multer from 'multer';
import { RequestHandler } from 'express';
export declare const upload: multer.Multer;
export declare const uploadSingle: (fieldName: string) => RequestHandler;
export declare const uploadMultiple: (fieldName: string, maxCount?: number) => RequestHandler;
//# sourceMappingURL=upload.middleware.d.ts.map