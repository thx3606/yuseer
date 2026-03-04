'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StatusPage() {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const orderId = searchParams?.get('id') || 'REQ_XXXXXXXX';

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#0a192f] text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#112240] to-[#0a192f] opacity-90" />
                <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.05),transparent_50%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="max-w-lg w-full bg-[#112240]/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-500" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="mx-auto w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 relative"
                >
                    <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-[spin_4s_linear_infinite]" />
                    <Clock className="w-12 h-12 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </motion.div>

                <h2 className="text-3xl font-extrabold text-white mb-2">طلبك قيد المراجعة</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    شكراً لاختيارك منصة يُسر. لقد استلمنا طلب تسجيل جمعيتكم بنجاح. سيقوم فريق النظام بمراجعة الطلب وتفعيل الحساب وإرسال رسالة لكم خلال <span className="font-bold text-amber-400">48 ساعة</span>.
                </p>

                <div className="bg-[#0a192f] border border-slate-700/50 rounded-2xl p-4 mb-8 text-right flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">رقم الطلب</p>
                        <p className="font-mono font-bold text-emerald-400">{orderId}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                </div>

                <div className="space-y-4">
                    <Link href="/" className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-[#0a192f] bg-emerald-500 hover:bg-emerald-400 focus:outline-none transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        العودة للصفحة الرئيسية
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
