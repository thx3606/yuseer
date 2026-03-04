import { Router, Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { logger } from '../utils/logger';

const router = Router();

// ====================================
// POST /api/v1/payments/webhook
// استقبال إشعارات بوابة الدفع ميسر (Moyasar)
// ====================================
router.post('/webhook', async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        // يفضل التأكد من التوقيع (Signature) من ميسر هنا لأسباب أمنية.
        // يتم عن طريق التوقيع المرفق بالهيدر باستخدام Secret API Key

        await PaymentService.handleMoyasarWebhook(payload);

        // إرجاع استجابة فورية 200 OK
        return res.status(200).send('OK');
    } catch (error) {
        logger.error('❌ Error handling webhook:', error);
        return res.status(500).json({ success: false });
    }
});

export default router;
