"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("./database"));
const logger_1 = require("../utils/logger");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await database_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                profile: true,
                teacher: true,
                student: true,
                guardian: true,
                examiner: true,
            },
        });
        if (!user) {
            logger_1.logger.warn(`Login attempt failed: User not found - ${email}`);
            return done(null, false, { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
        if (!user.isActive) {
            logger_1.logger.warn(`Login attempt failed: Inactive account - ${email}`);
            return done(null, false, { message: 'هذا الحساب غير نشط. يرجى التواصل مع الإدارة' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            logger_1.logger.warn(`Login attempt failed: Invalid password - ${email}`);
            return done(null, false, { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
        await database_1.default.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        logger_1.logger.info(`User logged in successfully: ${email}`);
        return done(null, user);
    }
    catch (error) {
        logger_1.logger.error('Error in local authentication strategy:', error);
        return done(error);
    }
}));
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await database_1.default.user.findUnique({
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
    }
    catch (error) {
        logger_1.logger.error('Error in JWT authentication strategy:', error);
        return done(error, false);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map