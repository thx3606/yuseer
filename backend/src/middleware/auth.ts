/**
 * ====================================
 * Middleware للمصادقة والتفويض
 * Authentication & Authorization Middleware
 * ====================================
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// تعريف واجهة للمستخدم
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware للتحقق من صحة التوكن
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // الحصول على التوكن من الهيدر
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول',
        messageEn: 'Unauthorized. Please login',
      });
      return;
    }

    const token = authHeader.substring(7); // إزالة "Bearer "

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
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

    // إضافة المستخدم إلى الطلب
    req.user = user;
    next();
  } catch (error: any) {
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

    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في المصادقة',
      messageEn: 'Authentication error',
    });
  }
};

/**
 * Middleware للتحقق من الأدوار (Roles)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول',
        messageEn: 'Unauthorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by user ${req.user.email} to resource requiring roles: ${roles.join(', ')}`
      );
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

/**
 * Middleware للتحقق من أن المستخدم هو صاحب المورد أو إداري
 */
export const authorizeOwnerOrAdmin = (resourceUserIdField: string = 'userId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'غير مصرح لك بالوصول',
          messageEn: 'Unauthorized',
        });
        return;
      }

      // السماح للمدراء
      if (
        req.user.role === UserRole.PLATFORM_OWNER ||
        req.user.role === UserRole.TENANT_ADMIN
      ) {
        next();
        return;
      }

      // التحقق من أن المستخدم هو صاحب المورد
      const resourceUserId =
        req.params[resourceUserIdField] || req.body[resourceUserIdField] || req.query[resourceUserIdField];

      if (req.user.id !== resourceUserId) {
        res.status(403).json({
          success: false,
          message: 'ليس لديك صلاحية للوصول إلى هذا المورد',
          messageEn: 'You do not have permission to access this resource',
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في التفويض',
        messageEn: 'Authorization error',
      });
    }
  };
};

/**
 * Middleware اختياري للمصادقة (يسمح بالوصول بدون تسجيل دخول)
 */
export const optionalAuthenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        profile: true,
      },
    });

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    // تجاهل الأخطاء والمتابعة بدون مستخدم
    next();
  }
};

/**
 * التحقق من صلاحيات محددة
 */
export const checkPermission = (permission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'غير مصرح لك بالوصول',
          messageEn: 'Unauthorized',
        });
        return;
      }

      // السماح للمدير العام دائماً
      if (req.user.role === UserRole.PLATFORM_OWNER || req.user.role === UserRole.TENANT_ADMIN) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        message: `ليس لديك صلاحية: ${permission}`,
        messageEn: `You do not have permission: ${permission}`,
      });
    } catch (error) {
      logger.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في التحقق من الصلاحيات',
        messageEn: 'Permission check error',
      });
    }
  };
};
