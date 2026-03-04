"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.optionalAuthenticate = exports.authorizeOwnerOrAdmin = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول',
                messageEn: 'Unauthorized. Please login',
            });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await database_1.default.user.findUnique({
            where: { id: decoded.id },
            include: {
                profile: true,
                teacher: true,
                student: true,
                guardian: true,
                examiner: true,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'المستخدم غير موجود',
                messageEn: 'User not found',
            });
            return;
        }
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: 'حسابك غير نشط. يرجى التواصل مع الإدارة',
                messageEn: 'Your account is inactive. Please contact administration',
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                message: 'توكن غير صالح',
                messageEn: 'Invalid token',
            });
            return;
        }
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى',
                messageEn: 'Token expired. Please login again',
            });
            return;
        }
        logger_1.logger.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في المصادقة',
            messageEn: 'Authentication error',
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'غير مصرح لك بالوصول',
                messageEn: 'Unauthorized',
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            logger_1.logger.warn(`Unauthorized access attempt by user ${req.user.email} to resource requiring roles: ${roles.join(', ')}`);
            res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية للوصول إلى هذا المورد',
                messageEn: 'You do not have permission to access this resource',
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const authorizeOwnerOrAdmin = (resourceUserIdField = 'userId') => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'غير مصرح لك بالوصول',
                    messageEn: 'Unauthorized',
                });
                return;
            }
            if (req.user.role === client_1.UserRole.PLATFORM_OWNER ||
                req.user.role === client_1.UserRole.TENANT_ADMIN) {
                next();
                return;
            }
            const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField] || req.query[resourceUserIdField];
            if (req.user.id !== resourceUserId) {
                res.status(403).json({
                    success: false,
                    message: 'ليس لديك صلاحية للوصول إلى هذا المورد',
                    messageEn: 'You do not have permission to access this resource',
                });
                return;
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('Authorization error:', error);
            res.status(500).json({
                success: false,
                message: 'خطأ في التفويض',
                messageEn: 'Authorization error',
            });
        }
    };
};
exports.authorizeOwnerOrAdmin = authorizeOwnerOrAdmin;
const optionalAuthenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await database_1.default.user.findUnique({
            where: { id: decoded.id },
            include: {
                profile: true,
            },
        });
        if (user && user.isActive) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'غير مصرح لك بالوصول',
                    messageEn: 'Unauthorized',
                });
                return;
            }
            if (req.user.role === client_1.UserRole.PLATFORM_OWNER || req.user.role === client_1.UserRole.TENANT_ADMIN) {
                next();
                return;
            }
            res.status(403).json({
                success: false,
                message: `ليس لديك صلاحية: ${permission}`,
                messageEn: `You do not have permission: ${permission}`,
            });
        }
        catch (error) {
            logger_1.logger.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                message: 'خطأ في التحقق من الصلاحيات',
                messageEn: 'Permission check error',
            });
        }
    };
};
exports.checkPermission = checkPermission;
//# sourceMappingURL=auth.js.map