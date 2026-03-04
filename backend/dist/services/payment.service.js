"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class PaymentService {
    static async handleMoyasarWebhook(payload) {
        try {
            if (payload.type === 'payment.paid' && payload.data && payload.data.status === 'paid') {
                const paymentData = payload.data;
                const tenantId = paymentData.metadata?.tenantId;
                if (!tenantId) {
                    logger_1.logger.warn(`Payment Webhook received without tenantId in metadata: ${paymentData.id}`);
                    return;
                }
                await database_1.default.$transaction(async (tx) => {
                    const tenant = await tx.tenant.findUnique({ where: { id: tenantId } });
                    if (!tenant)
                        return;
                    if (tenant.status !== client_1.TenantStatus.ACTIVE) {
                        await tx.tenant.update({
                            where: { id: tenantId },
                            data: { status: client_1.TenantStatus.ACTIVE, paymentRef: paymentData.id },
                        });
                        await tx.user.updateMany({
                            where: { tenantId: tenantId, role: 'TENANT_ADMIN' },
                            data: { isActive: true },
                        });
                        logger_1.logger.info(`✅ Tenant ${tenant.name} activated automatically via Moyasar payment`);
                    }
                });
            }
            else {
                logger_1.logger.info(`Moyasar Webhook received other event: ${payload.type}`);
            }
        }
        catch (error) {
            logger_1.logger.error('Error handling Moyasar webhook:', error);
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;
exports.default = PaymentService;
//# sourceMappingURL=payment.service.js.map