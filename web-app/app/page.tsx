'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a192f] text-slate-300">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#112240] to-[#0a192f] opacity-90" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.1),transparent_50%)]" />
            </div>

            <div className="z-10 max-w-5xl mx-auto px-6 w-full text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 rounded-full blur-2xl absolute inset-0 animate-pulse" />
                    <div className="w-32 h-32 bg-[#112240]/80 backdrop-blur-xl border border-emerald-500/30 rounded-full flex items-center justify-center relative shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        <svg className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-200 drop-shadow-sm"
                >
                    نظام يُسْر
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mb-12"
                >
                    المنصة الفاخرة لإدارة مدارس تحفيظ القرآن الكريم والمتون العلمية. تجربة رقمية متطورة تليق بعظمة الكتاب وأهله.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md mx-auto"
                >
                    <Link
                        href="/dashboard"
                        className="group relative px-8 py-4 bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-md rounded-2xl font-bold text-white text-lg transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-emerald-400/30 overflow-hidden flex-1"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            الدخول للوحة التحكم
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-[2.0] blur-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shine_1.5s_ease-out_infinite]" />
                    </Link>

                    <Link
                        href="/login"
                        className="group px-8 py-4 bg-[#112240]/50 hover:bg-[#112240] backdrop-blur-md rounded-2xl font-bold text-emerald-100 text-lg transition-all duration-300 border border-emerald-500/20 hover:border-emerald-500/50 flex-1 flex items-center justify-center hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                    >
                        تسجيل الدخول
                    </Link>
                </motion.div>

                {/* Pricing Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-32 w-full max-w-6xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm">باقات الاشتراك</h2>
                    <p className="text-slate-400 mb-12 text-lg">اختر الباقة المناسبة لجمعيتك القرآنية وابدأ رحلة التحول الرقمي</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                        {/* الباقة الأساسية */}
                        <div className="bg-[#112240]/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden flex flex-col">
                            <h3 className="text-xl font-bold text-slate-200 mb-2">الباقة الأساسية</h3>
                            <p className="text-slate-400 text-sm mb-6">للحلقات والمجمعات الصغيرة</p>
                            <div className="mb-6">
                                <span className="text-4xl font-black text-white">299</span>
                                <span className="text-slate-400"> ريال / شهرياً</span>
                            </div>
                            <ul className="mb-8 space-y-4 flex-1">
                                <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> إدارة حتى 200 طالب</li>
                                <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> لوحة تحكم الإدارة والمعلمين</li>
                                <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> تقييم الحفظ والمراجعة</li>
                            </ul>
                            <Link href="/register?plan=basic" className="w-full py-3 rounded-xl border border-emerald-500/50 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white transition-all text-center">اشترك الآن</Link>
                        </div>

                        {/* الباقة المتقدمة - مميزة */}
                        <div className="bg-gradient-to-b from-[#112240] to-[#0a192f] backdrop-blur-xl rounded-3xl p-8 border border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] transform md:-translate-y-4 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">الأكثر طلباً</div>
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_70%)] pointer-events-none" />
                            <h3 className="text-2xl font-bold text-emerald-300 mb-2 relative z-10">الباقة المتقدمة</h3>
                            <p className="text-emerald-100/60 text-sm mb-6 relative z-10">للجمعيات والمدارس المتوسطة</p>
                            <div className="mb-6 relative z-10">
                                <span className="text-5xl font-black text-white">499</span>
                                <span className="text-emerald-100/60"> ريال / شهرياً</span>
                            </div>
                            <ul className="mb-8 space-y-4 flex-1 relative z-10">
                                <li className="flex items-center gap-3 text-slate-200"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> إدارة حتى 1000 طالب</li>
                                <li className="flex items-center gap-3 text-slate-200"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> جميع مميزات الباقة الأساسية</li>
                                <li className="flex items-center gap-3 text-slate-200"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> تطبيق أولياء الأمور والرسائل</li>
                                <li className="flex items-center gap-3 text-slate-200"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> إصدار الشهادات التلقائي</li>
                            </ul>
                            <Link href="/register?plan=advanced" className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-all text-center shadow-[0_0_15px_rgba(16,185,129,0.4)] relative z-10">ابدأ الفترة التجريبية</Link>
                        </div>

                        {/* الباقة الاحترافية */}
                        <div className="bg-[#112240]/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden flex flex-col">
                            <h3 className="text-xl font-bold text-slate-200 mb-2">الباقة المؤسسية</h3>
                            <p className="text-slate-400 text-sm mb-6">للجمعيات الكبرى والفروع المتعددة</p>
                            <div className="mb-6">
                                <span className="text-4xl font-black text-white">999</span>
                                <span className="text-slate-400"> ريال / شهرياً</span>
                            </div>
                            <ul className="mb-8 space-y-4 flex-1">
                                <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> عدد غير محدود من الطلاب</li>
                                <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> إدارة الفروع والمجمعات المتعددة</li>
                                <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> بوابة الدفع الإلكتروني (Moyasar)</li>
                                <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> دعم فني مخصص 24/7</li>
                            </ul>
                            <Link href="/register?plan=enterprise" className="w-full py-3 rounded-xl border border-amber-500/50 text-amber-400 font-bold hover:bg-amber-500 hover:text-white transition-all text-center">تواصل معنا</Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Islamic Pattern overlay - subtle */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2310b981\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
    );
}
