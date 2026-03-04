/**
 * ====================================
 * الخادم الرئيسي
 * Main Server
 * ====================================
 * نظام إدارة مدارس تحفيظ القرآن الكريم
 * Quranic Schools Management System
 * ====================================
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

// استيراد الإعدادات
import { connectDatabase } from './config/database';
import { logger, logHttpRequest } from './utils/logger';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';

// استيراد المسارات (سيتم إنشاؤها لاحقاً)
import demoRoutes from './routes/demo.routes';
import authRoutes from './routes/auth.routes';
import tenantRoutes from './routes/tenant.routes';
import paymentRoutes from './routes/payment.routes';
import admissionRoutes from './routes/admission.routes';
// import userRoutes from './routes/user.routes';
// ... المزيد من المسارات

// تحميل متغيرات البيئة
dotenv.config();

// تهيئة Express
const app: Application = express();
const PORT = process.env.PORT || 5000;

// ====================================
// Middleware - الوسائط
// ====================================

// الأمان
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

// معالجة JSON و URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookies
app.use(cookieParser());

// ضغط الاستجابات
app.use(compression());

// السجلات (Logging)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// تسجيل جميع الطلبات
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logHttpRequest(req, res, duration);
  });

  next();
});

// تحديد عدد الطلبات (Rate Limiting)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 دقيقة
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 طلب
  message: {
    success: false,
    message: 'تم تجاوز عدد الطلبات المسموح به. يرجى المحاولة لاحقاً.',
    messageEn: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// الملفات الثابتة
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/certificates', express.static(path.join(__dirname, '../certificates')));
app.use('/reports', express.static(path.join(__dirname, '../reports')));
app.use(express.static(path.join(__dirname, '../public'))); // صفحة HTML الرئيسية

// ====================================
// الصحة والمعلومات | Health & Info
// ====================================

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'نظام إدارة مدارس تحفيظ القرآن الكريم',
    messageEn: 'Quranic Schools Management System API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', async (_req: Request, res: Response) => {
  try {
    // فحص الاتصال بقاعدة البيانات
    const { healthCheck } = await import('./config/database');
    const dbHealthy = await healthCheck();

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'connected' : 'disconnected',
        server: 'running',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Service unavailable',
    });
  }
});

// ====================================
// API Routes
// ====================================

const API_VERSION = process.env.API_VERSION || 'v1';

// مسارات التجربة والاختبار
app.use(`/api/${API_VERSION}/demo`, demoRoutes);

// مسارات المصادقة
app.use(`/api/${API_VERSION}/auth`, authRoutes);

// مسارات المستأجرين والجمعيات والمدفوعات
app.use(`/api/${API_VERSION}/tenants`, tenantRoutes);
app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/admissions`, admissionRoutes);

// المسارات (سيتم إضافتها تدريجياً)
// app.use(`/api/${API_VERSION}/users`, userRoutes);
// app.use(`/api/${API_VERSION}/students`, studentRoutes);
// app.use(`/api/${API_VERSION}/teachers`, teacherRoutes);
// app.use(`/api/${API_VERSION}/classes`, classRoutes);
// app.use(`/api/${API_VERSION}/evaluations`, evaluationRoutes);
// app.use(`/api/${API_VERSION}/exams`, examRoutes);
// app.use(`/api/${API_VERSION}/messages`, messageRoutes);
// app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
// app.use(`/api/${API_VERSION}/reports`, reportRoutes);
// app.use(`/api/${API_VERSION}/certificates`, certificateRoutes);
// app.use(`/api/${API_VERSION}/organizations`, organizationRoutes);

// مسار تجريبي مؤقت
app.get(`/api/${API_VERSION}/test`, (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is working!',
    messageAr: 'الواجهة البرمجية تعمل بنجاح!',
    version: API_VERSION,
  });
});

// ====================================
// معالجة الأخطاء | Error Handling
// ====================================

// 404 - الصفحة غير موجودة
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
    messageEn: 'Route not found',
    path: req.originalUrl,
  });
});

// معالج الأخطاء العام
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'حدث خطأ في الخادم';

  res.status(statusCode).json({
    success: false,
    message,
    messageEn: err.messageEn || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
});

// ====================================
// تشغيل الخادم | Start Server
// ====================================

const startServer = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await connectDatabase();

    // تهيئة الخدمات
    EmailService.initialize();
    WhatsAppService.initialize();

    // بدء الاستماع
    app.listen(PORT, () => {
      logger.info('='.repeat(60));
      logger.info('🕌 نظام إدارة مدارس تحفيظ القرآن الكريم');
      logger.info('   Quranic Schools Management System');
      logger.info('='.repeat(60));
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🌐 API Version: ${API_VERSION}`);
      logger.info(`📍 URL: http://localhost:${PORT}`);
      logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
      logger.info('='.repeat(60));
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// معالجة إيقاف التطبيق بشكل سليم (Graceful Shutdown)
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  const { disconnectDatabase } = await import('./config/database');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  const { disconnectDatabase } = await import('./config/database');
  await disconnectDatabase();
  process.exit(0);
});

// معالجة الأخطاء غير المعالجة
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// تشغيل الخادم
startServer();

export default app;
