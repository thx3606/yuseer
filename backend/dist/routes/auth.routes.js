"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, gender } = req.body;
        if (!email || !password || !role || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة',
                messageEn: 'All fields are required',
                required: ['email', 'password', 'role', 'firstName', 'lastName'],
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني غير صحيح',
                messageEn: 'Invalid email format',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                messageEn: 'Password must be at least 6 characters',
            });
        }
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
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
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        logger_1.logger.info(`✅ تسجيل مستخدم جديد: ${email}`);
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
    }
    catch (error) {
        logger_1.logger.error('❌ خطأ في التسجيل:', error);
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء التسجيل',
            messageEn: 'Registration error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني وكلمة المرور مطلوبان',
                messageEn: 'Email and password are required',
            });
        }
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
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'الحساب غير نشط، يرجى التواصل مع الإدارة',
                messageEn: 'Account is inactive',
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
                messageEn: 'Invalid email or password',
            });
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        logger_1.logger.info(`✅ تسجيل دخول: ${email} - ${user.role}`);
        const userData = {
            id: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            profile: user.profile,
        };
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
    }
    catch (error) {
        logger_1.logger.error('❌ خطأ في تسجيل الدخول:', error);
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء تسجيل الدخول',
            messageEn: 'Login error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'يرجى تسجيل الدخول',
                messageEn: 'Authentication required',
            });
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
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
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json({
            success: true,
            data: { user: userWithoutPassword },
        });
    }
    catch (error) {
        logger_1.logger.error('❌ خطأ في الحصول على بيانات المستخدم:', error);
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
router.post('/change-password', async (req, res) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
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
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'كلمة المرور الحالية غير صحيحة',
                messageEn: 'Current password is incorrect',
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
                messageEn: 'New password must be at least 6 characters',
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        logger_1.logger.info(`✅ تغيير كلمة المرور: ${user.email}`);
        return res.status(200).json({
            success: true,
            message: 'تم تغيير كلمة المرور بنجاح',
            messageEn: 'Password changed successfully',
        });
    }
    catch (error) {
        logger_1.logger.error('❌ خطأ في تغيير كلمة المرور:', error);
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم',
            messageEn: 'Server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map