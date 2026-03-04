"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const email_service_1 = require("./services/email.service");
const whatsapp_service_1 = require("./services/whatsapp.service");
const demo_routes_1 = __importDefault(require("./routes/demo.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tenant_routes_1 = __importDefault(require("./routes/tenant.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const admission_routes_1 = __importDefault(require("./routes/admission.routes"));
const teacher_routes_1 = __importDefault(require("./routes/teacher.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        (0, logger_1.logHttpRequest)(req, res, duration);
    });
    next();
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: 'تم تجاوز عدد الطلبات المسموح به. يرجى المحاولة لاحقاً.',
        messageEn: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/certificates', express_1.default.static(path_1.default.join(__dirname, '../certificates')));
app.use('/reports', express_1.default.static(path_1.default.join(__dirname, '../reports')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'نظام إدارة مدارس تحفيظ القرآن الكريم',
        messageEn: 'Quranic Schools Management System API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
    });
});
app.get('/health', async (_req, res) => {
    try {
        const { healthCheck } = await Promise.resolve().then(() => __importStar(require('./config/database')));
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
    }
    catch (error) {
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: 'Service unavailable',
        });
    }
});
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/demo`, demo_routes_1.default);
app.use(`/api/${API_VERSION}/auth`, auth_routes_1.default);
app.use(`/api/${API_VERSION}/tenants`, tenant_routes_1.default);
app.use(`/api/${API_VERSION}/payments`, payment_routes_1.default);
app.use(`/api/${API_VERSION}/admissions`, admission_routes_1.default);
app.use(`/api/${API_VERSION}/teachers`, teacher_routes_1.default);
app.get(`/api/${API_VERSION}/test`, (_req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        messageAr: 'الواجهة البرمجية تعمل بنجاح!',
        version: API_VERSION,
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'المسار غير موجود',
        messageEn: 'Route not found',
        path: req.originalUrl,
    });
});
app.use((err, _req, res, _next) => {
    logger_1.logger.error('Unhandled error:', err);
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
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        email_service_1.EmailService.initialize();
        whatsapp_service_1.WhatsAppService.initialize();
        app.listen(PORT, () => {
            logger_1.logger.info('='.repeat(60));
            logger_1.logger.info('🕌 نظام إدارة مدارس تحفيظ القرآن الكريم');
            logger_1.logger.info('   Quranic Schools Management System');
            logger_1.logger.info('='.repeat(60));
            logger_1.logger.info(`🚀 Server running on port ${PORT}`);
            logger_1.logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger_1.logger.info(`🌐 API Version: ${API_VERSION}`);
            logger_1.logger.info(`📍 URL: http://localhost:${PORT}`);
            logger_1.logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
            logger_1.logger.info('='.repeat(60));
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM signal received: closing HTTP server');
    const { disconnectDatabase } = await Promise.resolve().then(() => __importStar(require('./config/database')));
    await disconnectDatabase();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT signal received: closing HTTP server');
    const { disconnectDatabase } = await Promise.resolve().then(() => __importStar(require('./config/database')));
    await disconnectDatabase();
    process.exit(0);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map