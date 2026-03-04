/**
 * ====================================
 * نظام السجلات الاحترافي
 * Professional Logging System
 * ====================================
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// إنشاء مجلد السجلات إذا لم يكن موجوداً
const logsDir = process.env.LOG_DIR || './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// تنسيق السجلات المخصص
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    // إضافة المعلومات الإضافية
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    // إضافة Stack Trace للأخطاء
    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

// تنسيق Console ملون
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} ${level}: ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// إعداد Daily Rotate File للسجلات العامة
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: customFormat,
});

// إعداد Daily Rotate File للأخطاء
const errorRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d',
  format: customFormat,
});

// إعداد Daily Rotate File للوصول (Access Logs)
const accessRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'access-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: customFormat,
});

// إنشاء Logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    // Console للتطوير
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),

    // ملفات السجلات
    fileRotateTransport,
    errorRotateTransport,
  ],
  // معالج للأخطاء غير المتوقعة
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  // معالج للرفض غير المعالج للوعود
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

// Logger خاص بسجلات الوصول
export const accessLogger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [accessRotateTransport],
});

/**
 * دالة مساعدة لتسجيل طلبات HTTP
 */
export const logHttpRequest = (req: any, res: any, duration: number) => {
  const log = {
    method: req.method,
    url: req.originalUrl || req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || 'anonymous',
  };

  accessLogger.info('HTTP Request', log);
};

/**
 * دالة مساعدة لتسجيل عمليات قاعدة البيانات
 */
export const logDatabaseOperation = (
  operation: string,
  model: string,
  duration: number,
  success: boolean
) => {
  const log = {
    operation,
    model,
    duration: `${duration}ms`,
    success,
  };

  if (success) {
    logger.debug('Database Operation', log);
  } else {
    logger.error('Database Operation Failed', log);
  }
};

/**
 * دالة مساعدة لتسجيل عمليات المصادقة
 */
export const logAuthAttempt = (
  email: string,
  success: boolean,
  ip?: string,
  reason?: string
) => {
  const log = {
    email,
    success,
    ip,
    reason,
    timestamp: new Date().toISOString(),
  };

  if (success) {
    logger.info('Authentication Success', log);
  } else {
    logger.warn('Authentication Failed', log);
  }
};

/**
 * دالة مساعدة لتسجيل الأخطاء
 */
export const logError = (
  message: string,
  error: Error | unknown,
  context?: Record<string, any>
) => {
  logger.error(message, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
};

/**
 * دالة مساعدة لتسجيل النجاح
 */
export const logSuccess = (message: string, context?: Record<string, any>) => {
  logger.info(`✅ ${message}`, context);
};

/**
 * دالة مساعدة لتسجيل التحذيرات
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  logger.warn(`⚠️ ${message}`, context);
};

export default logger;
