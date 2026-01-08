import { JWTPayload } from '../types';
export declare const signJWT: (payload: JWTPayload) => string;
export declare const signRefreshJWT: (payload: Partial<JWTPayload>) => string;
export declare const verifyJWT: (token: string) => JWTPayload;
export declare const verifyRefreshJWT: (token: string) => Partial<JWTPayload>;
//# sourceMappingURL=jwt.util.d.ts.map