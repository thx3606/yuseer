"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarning = exports.logSuccess = exports.logError = exports.logAuthAttempt = exports.logDatabaseOperation = exports.logHttpRequest = exports.accessLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logsDir = process.env.LOG_DIR || './logs';
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
        log += `\n${stack}`;
    }
    return log;
}));
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} ${level}: ${message}`;
    if (stack) {
        log += `\n${stack}`;
    }
    return log;
}));
const fileRotateTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logsDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: customFormat,
});
const errorRotateTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d',
    format: customFormat,
});
const accessRotateTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logsDir, 'access-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: customFormat,
});
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports: [
        ...(process.env.NODE_ENV !== 'production'
            ? [
                new winston_1.default.transports.Console({
                    format: consoleFormat,
                }),
            ]
            : []),
        fileRotateTransport,
        errorRotateTransport,
    ],
    exceptionHandlers: [
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logsDir, 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
    rejectionHandlers: [
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logsDir, 'rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
});
exports.accessLogger = winston_1.default.createLogger({
    level: 'info',
    format: customFormat,
    transports: [accessRotateTransport],
});
const logHttpRequest = (req, res, duration) => {
    const log = {
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anonymous',
    };
    exports.accessLogger.info('HTTP Request', log);
};
exports.logHttpRequest = logHttpRequest;
const logDatabaseOperation = (operation, model, duration, success) => {
    const log = {
        operation,
        model,
        duration: `${duration}ms`,
        success,
    };
    if (success) {
        exports.logger.debug('Database Operation', log);
    }
    else {
        exports.logger.error('Database Operation Failed', log);
    }
};
exports.logDatabaseOperation = logDatabaseOperation;
const logAuthAttempt = (email, success, ip, reason) => {
    const log = {
        email,
        success,
        ip,
        reason,
        timestamp: new Date().toISOString(),
    };
    if (success) {
        exports.logger.info('Authentication Success', log);
    }
    else {
        exports.logger.warn('Authentication Failed', log);
    }
};
exports.logAuthAttempt = logAuthAttempt;
const logError = (message, error, context) => {
    exports.logger.error(message, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...context,
    });
};
exports.logError = logError;
const logSuccess = (message, context) => {
    exports.logger.info(`✅ ${message}`, context);
};
exports.logSuccess = logSuccess;
const logWarning = (message, context) => {
    exports.logger.warn(`⚠️ ${message}`, context);
};
exports.logWarning = logWarning;
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map