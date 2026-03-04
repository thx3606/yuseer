"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.disconnectDatabase = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient({
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
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
        logger_1.logger.debug('Query: ' + e.query);
        logger_1.logger.debug('Duration: ' + e.duration + 'ms');
    });
}
prisma.$on('error', (e) => {
    logger_1.logger.error('Prisma Error:', e);
});
prisma.$on('info', (e) => {
    logger_1.logger.info('Prisma Info:', e);
});
prisma.$on('warn', (e) => {
    logger_1.logger.warn('Prisma Warning:', e);
});
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        logger_1.logger.info('✅ Database connected successfully');
    }
    catch (error) {
        logger_1.logger.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await prisma.$disconnect();
        logger_1.logger.info('Database disconnected');
    }
    catch (error) {
        logger_1.logger.error('Error disconnecting database:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
const healthCheck = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        logger_1.logger.error('Database health check failed:', error);
        return false;
    }
};
exports.healthCheck = healthCheck;
exports.default = prisma;
//# sourceMappingURL=database.js.map