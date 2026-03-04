/**
 * ====================================
 * خدمة المصادقة
 * Authentication Service
 * ====================================
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, Gender } from '@prisma/client';
import prisma from '../config/database';
import { logger, logAuthAttempt } from '../utils/logger';

interface RegisterDTO {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  city?: string;
  address?: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface AuthResponse {
  user: Partial<User>;
  token: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * تسجيل مستخدم جديد
   */
  static async register(data: RegisterDTO): Promise<AuthResponse> {
    try {
      // التحقق من وجود المستخدم
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (existingUser) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }

      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(
        data.password,
        parseInt(process.env.BCRYPT_ROUNDS || '12')
      );

      // إنشاء المستخدم مع الملف الشخصي
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          role: data.role,
          profile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              firstNameAr: data.firstNameAr,
              lastNameAr: data.lastNameAr,
              phoneNumber: data.phoneNumber,
              whatsappNumber: data.whatsappNumber,
              dateOfBirth: data.dateOfBirth,
              gender: data.gender,
              nationality: data.nationality,
              city: data.city,
              address: data.address,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      // إنشاء السجل الخاص بالدور
      await this.createRoleSpecificRecord(user.id, data.role);

      logger.info(`New user registered: ${user.email} with role ${user.role}`);

      // إنشاء التوكنات
      const token = this.generateToken(user.id, user.email, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        user: this.sanitizeUser(user),
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * تسجيل الدخول
   */
  static async login(data: LoginDTO, ip?: string): Promise<AuthResponse> {
    try {
      // البحث عن المستخدم
      const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
        include: {
          profile: true,
          teacher: true,
          student: true,
          guardian: true,
          examiner: true,
        },
      });

      if (!user) {
        logAuthAttempt(data.email, false, ip, 'User not found');
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      // التحقق من نشاط الحساب
      if (!user.isActive) {
        logAuthAttempt(data.email, false, ip, 'Account inactive');
        throw new Error('هذا الحساب غير نشط. يرجى التواصل مع الإدارة');
      }

      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        logAuthAttempt(data.email, false, ip, 'Invalid password');
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      // تحديث آخر تسجيل دخول
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      logAuthAttempt(data.email, true, ip);

      // إنشاء التوكنات
      const token = this.generateToken(user.id, user.email, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        user: this.sanitizeUser(user),
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * تحديث التوكن باستخدام Refresh Token
   */
  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
      ) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      const newToken = this.generateToken(user.id, user.email, user.role);
      const newRefreshToken = this.generateRefreshToken(user.id);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * تغيير كلمة المرور
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // التحقق من كلمة المرور الحالية
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
      }

      // تشفير كلمة المرور الجديدة
      const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.BCRYPT_ROUNDS || '12')
      );

      // تحديث كلمة المرور
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * إعادة تعيين كلمة المرور
   */
  static async resetPassword(email: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        // لا نكشف أن المستخدم غير موجود لأسباب أمنية
        logger.warn(`Password reset attempt for non-existent email: ${email}`);
        return 'إذا كان البريد الإلكتروني موجوداً، سيتم إرسال رابط إعادة تعيين كلمة المرور';
      }

      // إنشاء توكن إعادة التعيين
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      logger.info(`Password reset token generated for user: ${email}`);

      // هنا يمكن إرسال البريد الإلكتروني مع الرابط
      // await EmailService.sendPasswordResetEmail(user.email, resetToken);

      return resetToken; // في بيئة الإنتاج، لا يتم إرجاع التوكن بل إرساله عبر البريد
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * تأكيد إعادة تعيين كلمة المرور
   */
  static async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.BCRYPT_ROUNDS || '12')
      );

      await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });

      logger.info(`Password reset confirmed for user ID: ${decoded.id}`);
    } catch (error) {
      logger.error('Confirm password reset error:', error);
      throw new Error('توكن غير صالح أو منتهي الصلاحية');
    }
  }

  /**
   * إنشاء JWT Token
   */
  private static generateToken(id: string, email: string, role: UserRole): string {
    // @ts-ignore
    return jwt.sign(
      { id, email, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  /**
   * إنشاء Refresh Token
   */
  private static generateRefreshToken(id: string): string {
    // @ts-ignore
    return jwt.sign(
      { id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
  }

  /**
   * تنظيف بيانات المستخدم (إزالة كلمة المرور)
   */
  private static sanitizeUser(user: any): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * إنشاء السجل الخاص بالدور
   */
  private static async createRoleSpecificRecord(userId: string, role: UserRole): Promise<void> {
    switch (role) {
      case UserRole.TEACHER:
        await prisma.teacher.create({
          data: { userId },
        });
        break;

      case UserRole.STUDENT:
        // إنشاء رقم طالب فريد
        const studentCode = await this.generateUniqueStudentCode();
        await prisma.student.create({
          data: {
            userId,
            studentCode,
          },
        });
        // إنشاء سجل تقدم القرآن
        await prisma.quranProgress.create({
          data: { studentId: userId },
        });
        // إنشاء سجل تقدم القاعدة النورانية
        await prisma.nooraniProgress.create({
          data: { studentId: userId },
        });
        break;

      case UserRole.PARENT:
        await prisma.guardian.create({
          data: { userId },
        });
        break;

      case UserRole.EXAMINER:
        await prisma.examiner.create({
          data: { userId },
        });
        break;

      default:
        break;
    }
  }

  /**
   * إنشاء رقم طالب فريد
   */
  private static async generateUniqueStudentCode(): Promise<string> {
    const count = await prisma.student.count();
    const code = `S${String(1000001 + count)}`;
    return code;
  }
}

export default AuthService;
