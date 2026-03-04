"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_service_1 = require("../services/payment.service");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;
        await payment_service_1.PaymentService.handleMoyasarWebhook(payload);
        return res.status(200).send('OK');
    }
    catch (error) {
        logger_1.logger.error('❌ Error handling webhook:', error);
        return res.status(500).json({ success: false });
    }
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map