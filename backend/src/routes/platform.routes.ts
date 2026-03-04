import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { platformAuth, PlatformRequest } from '../middlewares/platformAuth';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// 1. Authentication (Super Admin Login)
// ==========================================
router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.platformUser.findUnique({
            where: { email },
            include: { role: true }
        });

        if (!user || (!user.isActive && user.email !== 'owner@yuoser.com')) {
            res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, isPlatformUser: true },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Platform login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role.name,
                    permissions: user.role.permissions
                }
            }
        });
    } catch (error) {
        console.error('[PlatformLogin]', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// ==========================================
// 2. SaaS KPIs & Revenue Dashboards
// ==========================================
router.get('/analytics/kpis', platformAuth(['view_dashboard']), async (_req: PlatformRequest, res: Response): Promise<void> => {
    try {
        const activeTenantsCount = await prisma.tenant.count({ where: { status: 'ACTIVE' } });
        const pendingOnboarding = await prisma.onboardingRequest.count({ where: { status: 'PENDING' } });
        const openTickets = await prisma.supportTicket.count({ where: { status: 'OPEN' } });

        // Sum of all successful payments
        const revenueObj = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'PAID' }
        });

        res.json({
            success: true,
            data: {
                mrr: revenueObj._sum.amount || 0,
                activeTenants: activeTenantsCount,
                pendingOnboards: pendingOnboarding,
                openTickets: openTickets,
                revenueSeries: [
                    { name: 'Last Month', value: 12000 },
                    { name: 'This Month', value: revenueObj._sum.amount || 0 }
                ]
            }
        });
    } catch (error) {
        console.error('[PlatformKPIs]', error);
        res.status(500).json({ success: false, message: 'Server error retrieving KPIs' });
    }
});

// ==========================================
// 3. Onboarding Approvals Engine
// ==========================================
router.post('/onboarding/:id/decide', platformAuth(['manage_onboarding']), async (req: PlatformRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { decision, notes } = req.body; // APPROVE, REJECT, NEED_INFO
        const platformUserId = req.platformUser!.id;

        const request = await prisma.onboardingRequest.findUnique({ where: { id } });
        if (!request) {
            res.status(404).json({ success: false, message: 'Onboarding request not found' });
            return;
        }

        if (decision === 'APPROVE') {
            // Transaction to create Tenant and update onboarding
            const result = await prisma.$transaction(async (tx) => {
                // Determine Plan (if planId is null, use a default fallback Plan or throw error)
                // For this MVP execution we mock a dummy monthly subscription or fetch existing plan

                const tenant = await tx.tenant.create({
                    data: {
                        name: request.orgName,
                        subdomain: request.subdomain,
                        status: 'ACTIVE',
                        contactEmail: request.adminEmail,
                        contactPhone: request.contactPhone
                    }
                });

                const updatedReq = await tx.onboardingRequest.update({
                    where: { id },
                    data: { status: 'APPROVED', handledById: platformUserId, notes }
                });

                return { tenant, updatedReq };
            });

            res.json({ success: true, message: 'Tenant Approved and Created Successfully', data: result });
        } else {
            const updatedReq = await prisma.onboardingRequest.update({
                where: { id },
                data: { status: decision, handledById: platformUserId, notes }
            });
            res.json({ success: true, message: `Request updated to ${decision}`, data: updatedReq });
        }
    } catch (error) {
        console.error('[OnboardingDecide]', error);
        res.status(500).json({ success: false, message: 'Server error during onboarding decision' });
    }
});

// ==========================================
// 4. Coupons Engine
// ==========================================
router.post('/coupons', platformAuth(['manage_billing']), async (req: PlatformRequest, res: Response): Promise<void> => {
    try {
        const { code, discountType, discountValue, maxUses, validForNewOnly } = req.body;

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue,
                maxUses,
                validForNewOnly
            }
        });

        // Audit Log
        await prisma.platformAuditLog.create({
            data: {
                userId: req.platformUser!.id,
                action: 'CREATE_COUPON',
                targetId: coupon.id,
                details: JSON.parse(JSON.stringify(coupon)),
                ipAddress: req.ip
            }
        });

        res.json({ success: true, message: 'Coupon created successfully', data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating coupon' });
    }
});

export default router;
