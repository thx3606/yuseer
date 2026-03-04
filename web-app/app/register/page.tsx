'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Building2, User, Mail, Phone, Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function RegisterTenantPage() {
    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const plan = searchParams?.get('plan') || 'basic';

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        nameAr: '',
        subdomain: '',
        contactEmail: '',
        contactPhone: '',
        adminFirstName: '',
        adminLastName: '',
        adminPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // في البيئة الحقيقية سيتصل بالباك اند
            // await axios.post('/api/v1/tenants/register', formData);

            // محاكاة الطلب
            await new Promise((resolve) => setTimeout(resolve, 2000));

            router.push('/status?id=TENANT_' + Math.floor(Math.random() * 10000));
        } catch (error) {
            console.error('Registration failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#0a192f] text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#112240] to-[#0a192f] opacity-90" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_50%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full space-y-8 bg-[#112240]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-emerald-500/20 shadow-[0_0_40px_rgba(0,0,0,0.3)] z-10"
            >
                <div>
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6">
                        <ArrowRight className="w-4 h-4 ml-1" />
                        العودة للرئيسية
                    </Link>
                    <h2 className="text-center text-3xl font-extrabold text-white">تسجيل جمعية جديدة</h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        {plan === 'basic' ? 'الباقة الأساسية' : plan === 'advanced' ? 'الباقة المتقدمة' : 'الباقة المؤسسية'} - أنشئ منصتك الرقمية
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between relative mb-8">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-700 -z-10 transform -translate-y-1/2" />
                    <div className="absolute right-0 top-1/2 h-0.5 bg-emerald-500 -z-10 transform -translate-y-1/2 transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>1</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>2</div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                            <h3 className="text-xl font-bold text-white mb-4">معلومات الجمعية</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300">اسم الجمعية (عربي) *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-emerald-500/50" />
                                        </div>
                                        <input name="nameAr" required value={formData.nameAr} onChange={handleChange} className="appearance-none block w-full pr-10 pl-3 py-3 border border-slate-600 rounded-xl bg-[#0a192f] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all" placeholder="جمعية تحفيظ القرآن المكنون" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300">اسم الجمعية (إنجليزي)</label>
                                    <input name="name" value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-slate-600 rounded-xl bg-[#0a192f] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all text-left" dir="ltr" placeholder="Maknoon Society" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300">الرابط المخصص (Subdomain) *</label>
                                <div className="flex rounded-xl shadow-sm border border-slate-600 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                                    <span className="inline-flex items-center px-4 rounded-r-xl border-l border-slate-600 bg-slate-800 text-slate-400 sm:text-sm min-w-max" dir="ltr">
                                        .yuoser.com
                                    </span>
                                    <input type="text" name="subdomain" required value={formData.subdomain} onChange={handleChange} className="flex-1 block w-full px-3 py-3 bg-[#0a192f] text-white focus:outline-none sm:text-sm text-left" dir="ltr" placeholder="maknoon" />
                                </div>
                            </div>

                            <button type="button" onClick={() => setStep(2)} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-[#112240] transition-all overflow-hidden">
                                <span className="relative z-10">الخطوة التالية</span>
                                <div className="absolute inset-0 h-full w-full scale-[2.0] blur-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shine_1.5s_ease-out_infinite]" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                            <h3 className="text-xl font-bold text-white mb-4">معلومات مدير النظام (Admin)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300">الاسم الأول *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-emerald-500/50" />
                                        </div>
                                        <input name="adminFirstName" required value={formData.adminFirstName} onChange={handleChange} className="appearance-none block w-full pr-10 pl-3 py-3 border border-slate-600 rounded-xl bg-[#0a192f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all" placeholder="أحمد" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300">الاسم الأخير *</label>
                                    <input name="adminLastName" required value={formData.adminLastName} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-slate-600 rounded-xl bg-[#0a192f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all" placeholder="محمد" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300">البريد الإلكتروني للإدارة *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-emerald-500/50" />
                                    </div>
                                    <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="appearance-none block w-full pr-10 pl-3 py-3 border border-slate-600 rounded-xl bg-[#0a192f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all text-left" dir="ltr" placeholder="admin@maknoon.com" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300">رقم التواصل *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-emerald-500/50" />
                                    </div>
                                    <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} className="appearance-none block w-full pr-10 pl-3 py-3 border border-slate-600 rounded-xl bg-[#0a192f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all text-left" dir="ltr" placeholder="0500000000" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300">كلمة المرور *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-emerald-500/50" />
                                    </div>
                                    <input type="password" name="adminPassword" required value={formData.adminPassword} onChange={handleChange} className="appearance-none block w-full pr-10 pl-3 py-3 border border-slate-600 rounded-xl bg-[#0a192f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all text-left" dir="ltr" placeholder="********" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-colors">السابق</button>
                                <button type="submit" disabled={loading} className="w-2/3 flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-[#112240] transition-all relative overflow-hidden disabled:opacity-70">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد التسجيل'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
