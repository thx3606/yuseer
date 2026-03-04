/**
 * ====================================
 * خدمة المدفوعات (Payment Service)
 * Payment Webhooks Integration (Moyasar)
 * ====================================
 */

import { TenantStatus } from '@prisma/client';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class PaymentService {
    /**
     * معالجة إشعار الويب من ميسر (Moyasar Webhook)
     */
    static async handleMoyasarWebhook(payload: any): Promise<void> {
        try {
            // 1. التحقق من حالة الدفع
            if (payload.type === 'payment.paid' && payload.data && payload.data.status === 'paid') {
                const paymentData = payload.data;

                // 2. استخراج المعرف المرجعي (مثال: tenantId_planId)
                // يتم عادة إرسال المعرف المخصص في حق metadata
                const tenantId = paymentData.metadata?.tenantId;

                if (!tenantId) {
                    logger.warn(`Payment Webhook received without tenantId in metadata: ${paymentData.id}`);
                    return;
                }

                // 3. تفعيل المستأجر والاشتراك
                await prisma.$transaction(async (tx) => {
                    // جلب المستأجر للتأكد
                    const tenant = await tx.tenant.findUnique({ where: { id: tenantId } });
                    if (!tenant) return;

                    // تحديث حالة المستأجر
                    if (tenant.status !== TenantStatus.ACTIVE) {
                        await tx.tenant.update({
                            where: { id: tenantId },
                            data: { status: TenantStatus.ACTIVE, paymentRef: paymentData.id },
                        });

                        // تفعيل مدراء المستأجر
                        await tx.user.updateMany({
                            where: { tenantId: tenantId, role: 'TENANT_ADMIN' },
                            data: { isActive: true },
                        });

                        logger.info(`✅ Tenant ${tenant.name} activated automatically via Moyasar payment`);
                    }

                    // تحديث فاتورة الدفع إذا كانت موجودة (مثال فقط)
                    // إنشاء عملية للمدفوعات في جدول Subscriptions / Invoices
                });
            } else {
                logger.info(`Moyasar Webhook received other event: ${payload.type}`);
            }
        } catch (error) {
            logger.error('Error handling Moyasar webhook:', error);
            throw error;
        }
    }
}

export default PaymentService;
