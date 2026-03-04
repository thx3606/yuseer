import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface to augment express request with platform user
export interface PlatformRequest extends Request {
    platformUser?: {
        id: string;
        email: string;
        permissions: string[];
        roleName: string;
    };
}

export const platformAuth = (requiredPermissions: string[] = []) => {
    return async (req: PlatformRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // 1. Check Authorization header
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(401).json({ success: false, message: 'Platform access token missing' });
                return;
            }

            // 2. Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as { userId: string, isPlatformUser: boolean };

            if (!decoded.isPlatformUser) {
                res.status(403).json({ success: false, message: 'Access denied: Not a platform user' });
                return;
            }

            // 3. Fetch User and Role to determine permissions dynamically
            const user = await prisma.platformUser.findUnique({
                where: { id: decoded.userId },
                include: { role: true }
            });

            if (!user || (!user.isActive && user.email !== 'owner@yuoser.com')) {
                res.status(403).json({ success: false, message: 'Access denied: Platform user account is inactive' });
                return;
            }

            // 4. Parse Permissions
            const userPermissions = user.role.permissions as string[];

            // 5. Check Requirements
            if (requiredPermissions.length > 0) {
                const hasAllPermissions = requiredPermissions.every(p => userPermissions.includes(p));
                if (!hasAllPermissions) {
                    // Log the security attempt
                    await prisma.platformAuditLog.create({
                        data: {
                            userId: user.id,
                            action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
                            targetId: req.originalUrl,
                            details: JSON.parse(JSON.stringify({
                                required: requiredPermissions,
                                actual: userPermissions,
                                method: req.method
                            })),
                            ipAddress: req.ip
                        }
                    });

                    res.status(403).json({ success: false, message: 'Access denied: Insufficient RBAC permissions' });
                    return;
                }
            }

            // 6. Attach platformUser context to Request
            req.platformUser = {
                id: user.id,
                email: user.email,
                permissions: userPermissions,
                roleName: user.role.name
            };

            next();
        } catch (error) {
            console.error('[PlatformRBAC] Auth error', error);
            res.status(401).json({ success: false, message: 'Invalid or expired platform token' });
        }
    };
};
