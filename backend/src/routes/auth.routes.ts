import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ====================================
// POST /api/v1/auth/register
// تسجيل مستخدم جديد
// ====================================
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role, firstName, lastName, gender } = req.body;

    // التحقق من البيانات المطلوبة
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة',
        messageEn: 'All fields are required',
        required: ['email', 'password', 'role', 'firstName', 'lastName'],
      });
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني غير صحيح',
        messageEn: 'Invalid email format',
      });
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        messageEn: 'Password must be at least 6 characters',
      });
    }

    // التحقق من وجود المستخدم مسبقاً
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'البريد الإلكتروني مستخدم بالفعل',
        messageEn: 'Email already exists',
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        profile: {
          create: {
            firstName,
            lastName,
            firstNameAr: firstName,
            lastNameAr: lastName,
            gender: gender || 'MALE',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // إنشاء الـ token
    // @ts-ignore
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`✅ تسجيل مستخدم جديد: ${email}`);

    return res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح',
      messageEn: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: {
            firstName: user.profile?.firstName,
            lastName: user.profile?.lastName,
            gender: user.profile?.gender,
          },
        },
        token,
      },
    });
  } catch (error: any) {
    logger.error('❌ خطأ في التسجيل:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التسجيل',
      messageEn: 'Registration error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ====================================
// POST /api/v1/auth/login
// تسجيل الدخول
// ====================================
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // التحقق من البيانات
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان',
        messageEn: 'Email and password are required',
      });
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        teacher: true,
        student: {
          include: {
            quranProgress: true,
          },
        },
        guardian: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        messageEn: 'Invalid email or password',
      });
    }

    // التحقق من حالة الحساب
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'الحساب غير نشط، يرجى التواصل مع الإدارة',
        messageEn: 'Account is inactive',
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        messageEn: 'Invalid email or password',
      });
    }

    // تحديث آخر تسجيل دخول
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // إنشاء الـ token
    // @ts-ignore
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`✅ تسجيل دخول: ${email} - ${user.role}`);

    // إعداد البيانات المرجعة حسب الدور
    const userData: any = {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      profile: user.profile,
    };

    // إضافة بيانات إضافية حسب الدور
    if (user.teacher) {
      userData.teacher = {
        id: user.teacher.id,
        specialization: user.teacher.specialization,
        experienceYears: user.teacher.experienceYears,
      };
    }

    if (user.student) {
      userData.student = {
        id: user.student.id,
        studentCode: user.student.studentCode,
        status: user.student.status,
        quranProgress: user.student.quranProgress,
      };
    }

    if (user.guardian) {
      userData.guardian = {
        id: user.guardian.id,
        relationship: user.guardian.relationship,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      messageEn: 'Login successful',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error: any) {
    logger.error('❌ خطأ في تسجيل الدخول:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول',
      messageEn: 'Login error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ====================================
// GET /api/v1/auth/me
// الحصول على بيانات المستخدم الحالي
// ====================================
router.get('/me', async (req: Request, res: Response) => {
  try {
    // الحصول على الـ token من الـ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'يرجى تسجيل الدخول',
        messageEn: 'Authentication required',
      });
    }

    const token = authHeader.substring(7);

    // التحقق من الـ token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // الحصول على بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        profile: true,
        teacher: true,
        student: {
          include: {
            quranProgress: true,
          },
        },
        guardian: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
        messageEn: 'User not found',
      });
    }

    // إزالة كلمة المرور من النتيجة
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: { user: userWithoutPassword },
    });
  } catch (error: any) {
    logger.error('❌ خطأ في الحصول على بيانات المستخدم:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'رمز المصادقة غير صحيح',
        messageEn: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
        messageEn: 'Token expired',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      messageEn: 'Server error',
    });
  }
});

// ====================================
// POST /api/v1/auth/change-password
// تغيير كلمة المرور
// ====================================
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'يرجى تسجيل الدخول',
        messageEn: 'Authentication required',
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
        messageEn: 'User not found',
      });
    }

    // التحقق من كلمة المرور الحالية
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة',
        messageEn: 'Current password is incorrect',
      });
    }

    // التحقق من كلمة المرور الجديدة
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
        messageEn: 'New password must be at least 6 characters',
      });
    }

    // تشفير وتحديث كلمة المرور
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    logger.info(`✅ تغيير كلمة المرور: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
      messageEn: 'Password changed successfully',
    });
  } catch (error: any) {
    logger.error('❌ خطأ في تغيير كلمة المرور:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم',
      messageEn: 'Server error',
    });
  }
});

export default router;
