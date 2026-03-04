import { User, UserRole, Gender } from '@prisma/client';
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
export declare class AuthService {
    static register(data: RegisterDTO): Promise<AuthResponse>;
    static login(data: LoginDTO, ip?: string): Promise<AuthResponse>;
    static refreshToken(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    static resetPassword(email: string): Promise<string>;
    static confirmPasswordReset(token: string, newPassword: string): Promise<void>;
    private static generateToken;
    private static generateRefreshToken;
    private static sanitizeUser;
    private static createRoleSpecificRecord;
}
export default AuthService;
//# sourceMappingURL=auth.service.d.ts.map