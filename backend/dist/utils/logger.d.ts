import winston from 'winston';
export declare const logger: winston.Logger;
export declare const accessLogger: winston.Logger;
export declare const logHttpRequest: (req: any, res: any, duration: number) => void;
export declare const logDatabaseOperation: (operation: string, model: string, duration: number, success: boolean) => void;
export declare const logAuthAttempt: (email: string, success: boolean, ip?: string, reason?: string) => void;
export declare const logError: (message: string, error: Error | unknown, context?: Record<string, any>) => void;
export declare const logSuccess: (message: string, context?: Record<string, any>) => void;
export declare const logWarning: (message: string, context?: Record<string, any>) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map