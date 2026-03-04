'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Check, X, Building, Mail, Phone, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';

const MOCK_REQUESTS = [
    { id: 'req_1', orgName: 'مدرسة اقرأ النموذجية', adminName: 'سعد العتيبي', email: 'saad@iqra.edu', phone: '0509988776', plan: 'الأساسية', date: 'منذ ساعتين' },
    { id: 'req_2', orgName: 'مجمع التبيان', adminName: 'خالد اليوسف', email: 'info@tibyan.org.sa', phone: '0551122334', plan: 'الشاملة', date: 'أمس' },
];

export default function PlatformOnboardingPage() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleDecision = async (id: string, decision: 'APPROVE' | 'REJECT') => {
        setActionLoading(id);
        // Simulate API call to /api/platform/onboarding/:id/decide
        await new Promise(res => setTimeout(res, 1200));
        setRequests(prev => prev.filter(r => r.id !== id));
        setActionLoading(null);
        setSuccessMessage(decision === 'APPROVE' ? 'تم الموافقة وإنشاء الساب دومين للجمعية بنجاح!' : 'تم رفض الطلب');
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">طلبات الانضمام وتأسيس الجمعيات (Onboarding)</h2>
                <p className="text-slate-500 mt-2">راجع طلبات المؤسسات الجديدة، تحقق من تصاريحها، وأصدر الموافقة ليتم إنشاء بيئاتهم السحابية تلقائياً.</p>
            </div>

            <AnimatePresence>
                {successMessage && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-4 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500 rounded-2xl text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-3 shadow-lg">
                        <Check className="w-5 h-5" /> {successMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                <AnimatePresence>
                    {requests.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <ShieldCheck className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-500">لا توجد طلبات معلقة حالياً</h3>
                        </motion.div>
                    ) : (
                        requests.map((req, idx) => (
                            <motion.div
                                layout
                                key={req.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                {/* INFO Column */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                                            <Building className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{req.orgName}</h3>
                                            <p className="text-sm font-medium text-slate-500">طلب في {req.date}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400">الإيميل الرسمي</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{req.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400">هاتف الممثل</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300" dir="ltr">{req.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                <FileText className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400">تصريح الجمعية (PDF)</p>
                                                <a href="#" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">عرض الملف <ExternalLink className="w-3 h-3" /></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION Column */}
                                <div className="w-full md:w-64 border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 pt-6 md:pt-0 md:pr-8 flex flex-col justify-center gap-3">
                                    <div className="mb-4 text-center">
                                        <p className="text-sm font-medium text-slate-500 mb-1">الخطة المطلوبة</p>
                                        <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-lg font-bold text-sm">
                                            {req.plan}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDecision(req.id, 'APPROVE')}
                                        disabled={actionLoading === req.id}
                                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        {actionLoading === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <><Check className="w-5 h-5 group-hover:scale-125 transition-transform" /> اعتماد النظام وتفعيله</>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDecision(req.id, 'REJECT')}
                                        disabled={actionLoading === req.id}
                                        className="w-full py-3 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 font-bold rounded-2xl border border-rose-200 dark:border-rose-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {actionLoading === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <><X className="w-5 h-5" /> رفض الطلب</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
