"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const generators_1 = require("../utils/generators");
class AuthService {
    static async register(data) {
        try {
            const existingUser = await database_1.default.user.findUnique({
                where: { email: data.email.toLowerCase() },
            });
            if (existingUser) {
                throw new Error('البريد الإلكتروني مستخدم بالفعل');
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            const user = await database_1.default.user.create({
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
            await this.createRoleSpecificRecord(user.id, data.role);
            logger_1.logger.info(`New user registered: ${user.email} with role ${user.role}`);
            const token = this.generateToken(user.id, user.email, user.role);
            const refreshToken = this.generateRefreshToken(user.id);
            return {
                user: this.sanitizeUser(user),
                token,
                refreshToken,
            };
        }
        catch (error) {
            logger_1.logger.error('Registration error:', error);
            throw error;
        }
    }
    static async login(data, ip) {
        try {
            const user = await database_1.default.user.findUnique({
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
                (0, logger_1.logAuthAttempt)(data.email, false, ip, 'User not found');
                throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
            if (!user.isActive) {
                (0, logger_1.logAuthAttempt)(data.email, false, ip, 'Account inactive');
                throw new Error('هذا الحساب غير نشط. يرجى التواصل مع الإدارة');
            }
            const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                (0, logger_1.logAuthAttempt)(data.email, false, ip, 'Invalid password');
                throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
            await database_1.default.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
            });
            (0, logger_1.logAuthAttempt)(data.email, true, ip);
            const token = this.generateToken(user.id, user.email, user.role);
            const refreshToken = this.generateRefreshToken(user.id);
            return {
                user: this.sanitizeUser(user),
                token,
                refreshToken,
            };
        }
        catch (error) {
            logger_1.logger.error('Login error:', error);
            throw error;
        }
    }
    static async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret');
            const user = await database_1.default.user.findUnique({
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
        }
        catch (error) {
            logger_1.logger.error('Refresh token error:', error);
            throw new Error('Invalid or expired refresh token');
        }
    }
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await database_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('المستخدم غير موجود');
            }
            const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error('كلمة المرور الحالية غير صحيحة');
            }
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            await database_1.default.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            logger_1.logger.info(`Password changed for user: ${user.email}`);
        }
        catch (error) {
            logger_1.logger.error('Change password error:', error);
            throw error;
        }
    }
    static async resetPassword(email) {
        try {
            const user = await database_1.default.user.findUnique({
                where: { email: email.toLowerCase() },
            });
            if (!user) {
                logger_1.logger.warn(`Password reset attempt for non-existent email: ${email}`);
                return 'إذا كان البريد الإلكتروني موجوداً، سيتم إرسال رابط إعادة تعيين كلمة المرور';
            }
            const resetToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
            logger_1.logger.info(`Password reset token generated for user: ${email}`);
            return resetToken;
        }
        catch (error) {
            logger_1.logger.error('Reset password error:', error);
            throw error;
        }
    }
    static async confirmPasswordReset(token, newPassword) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            await database_1.default.user.update({
                where: { id: decoded.id },
                data: { password: hashedPassword },
            });
            logger_1.logger.info(`Password reset confirmed for user ID: ${decoded.id}`);
        }
        catch (error) {
            logger_1.logger.error('Confirm password reset error:', error);
            throw new Error('توكن غير صالح أو منتهي الصلاحية');
        }
    }
    static generateToken(id, email, role) {
        return jsonwebtoken_1.default.sign({ id, email, role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: process.env.JWT_EXPIRE || '7d' });
    }
    static generateRefreshToken(id) {
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' });
    }
    static sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
    static async createRoleSpecificRecord(userId, role) {
        switch (role) {
            case client_1.UserRole.TEACHER:
                await database_1.default.teacher.create({
                    data: { userId },
                });
                break;
            case client_1.UserRole.STUDENT:
                const studentUser = await database_1.default.user.findUnique({ where: { id: userId } });
                const tId = studentUser?.tenantId;
                const studentCode = await (0, generators_1.generateTenantStudentCode)(tId || 'dummy');
                await database_1.default.student.create({
                    data: {
                        userId,
                        studentCode,
                    },
                });
                await database_1.default.quranProgress.create({
                    data: { studentId: userId },
                });
                await database_1.default.nooraniProgress.create({
                    data: { studentId: userId },
                });
                break;
            case client_1.UserRole.PARENT:
                await database_1.default.guardian.create({
                    data: { userId },
                });
                break;
            case client_1.UserRole.EXAMINER:
                await database_1.default.examiner.create({
                    data: { userId },
                });
                break;
            default:
                break;
        }
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map