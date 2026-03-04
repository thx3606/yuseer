'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Phone, MapPin, Hash, Users, Clock, ArrowRight, Loader2, Save } from 'lucide-react';

export default function AddStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nationalId: '',
        dateOfBirth: '',
        gender: 'MALE',
        phone: '',
        address: '',
        shift: 'MORNING',
        guardianName: '',
        guardianPhone: '',
        relation: 'FATHER'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // محاكاة الاتصال بالخادم
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/dashboard/students');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/students" className="p-2 border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground group">
                    <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">إضافة طالب جديد</h2>
                    <p className="text-muted-foreground mt-1">إدخال بيانات الطالب وتحديد الفترة والحلقة.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* البيانات الأساسية */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            البيانات الشخصية
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">الاسم الأول *</label>
                            <input name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground" placeholder="عبدالرحمن" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">اسم العائلة *</label>
                            <input name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground" placeholder="السالم" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">رقم الهوية الوطنية / الإقامة *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input name="nationalId" required value={formData.nationalId} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-left text-foreground" dir="ltr" placeholder="10xxxxxxxx" minLength={10} maxLength={10} />
                            </div>
                            <p className="text-xs text-muted-foreground">يجب أن يتكون من 10 أرقام.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">الجنس *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground">
                                <option value="MALE">ذكر</option>
                                <option value="FEMALE">أنثى</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">رقم الهاتف *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-left text-foreground" dir="ltr" placeholder="05xxxxxxxx" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">تاريخ الميلاد *</label>
                            <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground" />
                        </div>
                    </div>
                </motion.div>

                {/* بيانات الحفظ والفترة */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            بيانات التسجيل الأكاديمي
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">الفترة الدراسية (Shift) *</label>
                            <select name="shift" required value={formData.shift} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground">
                                <option value="MORNING">الصباحية</option>
                                <option value="AFTERNOON">العصر</option>
                                <option value="EVENING">المغرب</option>
                                <option value="NIGHT">العشاء</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">مقدار الحفظ السابق</label>
                            <select className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground">
                                <option value="">لم يسبق له الحفظ</option>
                                <option value="1">جزء واحد</option>
                                <option value="3">3 أجزاء</option>
                                <option value="5">5 أجزاء</option>
                                <option value="10">10 أجزاء</option>
                                <option value="30">خاتم للقرآن</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* بيانات الولي */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            بيانات ولي الأمر
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">اسم الولي *</label>
                            <input name="guardianName" required value={formData.guardianName} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground" placeholder="اسم ولي الأمر" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">صلة القرابة *</label>
                            <select name="relation" required value={formData.relation} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground">
                                <option value="FATHER">أب</option>
                                <option value="MOTHER">أم</option>
                                <option value="BROTHER">أخ</option>
                                <option value="OTHER">أخرى</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">رقم هاتف الولي *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input name="guardianPhone" required value={formData.guardianPhone} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-left text-foreground" dir="ltr" placeholder="05xxxxxxxx" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => router.back()} className="px-8 py-4 rounded-xl border border-border font-bold text-muted-foreground hover:bg-muted transition-colors">
                        إلغاء
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-70 group relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            حفظ وتسجيل الطالب
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-[2.0] blur-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shine_1.5s_ease-out_infinite]" />
                    </button>
                </div>
            </form>
        </div>
    );
}
