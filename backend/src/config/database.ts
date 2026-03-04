/**
 * ====================================
 * إعدادات قاعدة البيانات
 * Database Configuration
 * ====================================
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// تهيئة Prisma Client مع الإعدادات المخصصة
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
  errorFormat: 'pretty',
});

// تسجيل الاستعلامات في بيئة التطوير
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug('Query: ' + e.query);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

// تسجيل الأخطاء
prisma.$on('error', (e: any) => {
  logger.error('Prisma Error:', e);
});

// تسجيل المعلومات
prisma.$on('info', (e: any) => {
  logger.info('Prisma Info:', e);
});

// تسجيل التحذيرات
prisma.$on('warn', (e: any) => {
  logger.warn('Prisma Warning:', e);
});

/**
 * الاتصال بقاعدة البيانات
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

/**
 * قطع الاتصال بقاعدة البيانات
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Error disconnecting database:', error);
  }
};

/**
 * فحص صحة الاتصال
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

export default prisma;
