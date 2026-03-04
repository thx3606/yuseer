/**
 * ====================================
 * إعدادات المصادقة - Passport
 * Authentication Configuration
 * ====================================
 */

import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import prisma from './database';
import { logger } from '../utils/logger';

/**
 * استراتيجية المصادقة المحلية (Local Strategy)
 * تستخدم للتسجيل الدخول بالبريد الإلكتروني وكلمة المرور
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // البحث عن المستخدم
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            profile: true,
            teacher: true,
            student: true,
            guardian: true,
            examiner: true,
          },
        });

        // إذا لم يوجد المستخدم
        if (!user) {
          logger.warn(`Login attempt failed: User not found - ${email}`);
          return done(null, false, { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // إذا كان الحساب غير نشط
        if (!user.isActive) {
          logger.warn(`Login attempt failed: Inactive account - ${email}`);
          return done(null, false, { message: 'هذا الحساب غير نشط. يرجى التواصل مع الإدارة' });
        }

        // التحقق من كلمة المرور
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          logger.warn(`Login attempt failed: Invalid password - ${email}`);
          return done(null, false, { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // تحديث آخر تسجيل دخول
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        logger.info(`User logged in successfully: ${email}`);
        return done(null, user);
      } catch (error) {
        logger.error('Error in local authentication strategy:', error);
        return done(error);
      }
    }
  )
);

/**
 * استراتيجية JWT (JSON Web Token Strategy)
 * تستخدم للتحقق من صحة التوكن في كل طلب
 */
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // البحث عن المستخدم
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id },
        include: {
          profile: true,
          teacher: true,
          student: true,
          guardian: true,
          examiner: true,
        },
      });

      if (!user) {
        return done(null, false);
      }

      if (!user.isActive) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      logger.error('Error in JWT authentication strategy:', error);
      return done(error, false);
    }
  })
);

export default passport;
