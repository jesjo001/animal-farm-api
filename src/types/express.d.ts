import { IUser } from '../models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Keep it optional here for standard Express behavior
      tenantId?: string;
    }
  }
}

// Add this to augment the Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    tenantId?: string;
  }
}