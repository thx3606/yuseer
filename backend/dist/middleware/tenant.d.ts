import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
export declare const requireTenant: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const withTenant: (req: AuthRequest, where?: any) => any;
//# sourceMappingURL=tenant.d.ts.map