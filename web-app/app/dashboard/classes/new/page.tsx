'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, BookOpen, Clock, Users, Shield, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data for the Wizard Selectors
const TEACHERS = [
    { id: '1', name: 'الشيخ عبدالباسط محمد', availableSpans: ['العصر', 'المغرب'] },
    { id: '2', name: 'الشيخ محمد محمود', availableSpans: ['الفجر', 'العشاء'] },
    { id: '3', name: 'أ. صالح إبراهيم', availableSpans: ['العصر'] }
];

const SHIFTS = [
    { id: 's1', name: 'الفجر', time: '04:30 ص - 06:00 ص' },
    { id: 's2', name: 'العصر', time: '04:00 م - 05:30 م' },
    { id: 's3', name: 'المغرب', time: '06:30 م - 07:45 م' },
    { id: 's4', name: 'العشاء', time: '08:30 م - 09:30 م' },
];

const CURRICULUMS = [
    'حفظ ومراجعة (مستمر)', 'متون التجويد', 'قاعدة نورانية', 'تسميع حر'
];

export default function ClassWizardPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        teacherId: '',
        shift: '',
        gender: 'MALE',
        capacity: 15,
        curriculum: '',
        level: 'مبتدئ'
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTeacherSelect = (teacherId: string) => {
        setFormData({ ...formData, teacherId });
    };

    const handleShiftSelect = (shift: string) => {
        setFormData({ ...formData, shift });
    };

    const handleCurriculumSelect = (curriculum: string) => {
        setFormData({ ...formData, curriculum });
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API Saving
        await new Promise(res => setTimeout(res, 2000));
        setLoading(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"
                >
                    <Check className="w-12 h-12" />
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-800">تم إنشاء الحلقة بنجاح!</h2>
                <p className="text-slate-500 max-w-md">تم حفظ بيانات الحلقة وإضافتها لجدول المعلم. يمكنك الآن البدء في تعيين الطلاب من قائمة الانتظار إلى هذه الحلقة مباشرة.</p>
                <div className="flex gap-4 mt-8">
                    <Link href="/dashboard/classes" className="px-6 py-3 bg-slate-100 font-bold text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                        العودة لقائمة الحلقات
                    </Link>
                    <Link href="/dashboard/admissions" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-colors">
                        تحويل الطلاب للحلقة
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/classes" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">تأسيس حلقة دراسية جديدة</h2>
                    <p className="text-slate-500 mt-1">ساحر إعداد الحلقات والمسارات - 4 خطوات بسيطة لبدء حلقة جديدة</p>
                </div>
            </div>

            {/* Progress STEPS Indicator */}
            <div className="flex justify-between relative mt-8 mb-12">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 h-1 bg-emerald-500 -z-10 rounded-full -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />

                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white transition-colors duration-300 ${step >= i ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {step > i ? <Check className="w-5 h-5" /> : i}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {/* STEP 1: Basic Info */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                                <BookOpen className="text-emerald-500 w-6 h-6" /> المعرّفات الأساسية
                            </h3>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600">اسم الحلقة (مميز)</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="مثال: حلقة الإمام عاصم للكبار" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600">القسم (بنين / بنات)</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                        <option value="MALE">بنين (رجال)</option>
                                        <option value="FEMALE">بنات (نساء)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600">السعة (الحد الأقصى للطلاب)</label>
                                    <input type="number" name="capacity" min={1} max={50} value={formData.capacity} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Curriculum & Level */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                                <Shield className="text-emerald-500 w-6 h-6" /> المسار والمستوى التعليمي
                            </h3>

                            <div className="space-y-4 mb-8">
                                <label className="text-sm font-bold text-slate-600">اختر نوع المسار / المنهج</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {CURRICULUMS.map((curr, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleCurriculumSelect(curr)}
                                            className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.curriculum === curr ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                                        >
                                            <p className="font-bold">{curr}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600">المستوى المبدئي للحلقة</label>
                                <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                    <option value="مبتدئ">مبتدئ (تأسيس)</option>
                                    <option value="متوسط">متوسط (حفظ وتثبيت)</option>
                                    <option value="متقدم">متقدم (مراجعة وإتقان)</option>
                                    <option value="إجازات">إجازات قرآنية</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Teacher Assignment */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                                <Users className="text-emerald-500 w-6 h-6" /> تفويض المعلم
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">اختر المعلم الذي سيتولى إدارة وتسميع هذا المسار. (تظهر فقط الأسماء غير الممتلئة جداولهم)</p>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {TEACHERS.map((teacher, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleTeacherSelect(teacher.id)}
                                        className={`p-4 border-2 rounded-2xl cursor-pointer flex justify-between items-center transition-all ${formData.teacherId === teacher.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center">
                                                {teacher.name.charAt(teacher.name.indexOf(' ') + 1) || 'م'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{teacher.name}</p>
                                                <p className="text-xs text-slate-500 mt-1">متاح في الفترات: {teacher.availableSpans.join('، ')}</p>
                                            </div>
                                        </div>
                                        {formData.teacherId === teacher.id && <Check className="w-6 h-6 text-emerald-500" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Shifts & Time */}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                                <Clock className="text-emerald-500 w-6 h-6" /> ربط فترة الدوام (Shift)
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">متى سيتم عقد هذه الحلقة؟ الفترات التالية هي الفترات المعتمدة في نظام جمعيتكم.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {SHIFTS.map((shift, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleShiftSelect(shift.name)}
                                        className={`p-5 border-2 rounded-2xl cursor-pointer text-center transition-all ${formData.shift === shift.name ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                                    >
                                        <p className="font-bold text-lg text-slate-800 mb-1">{shift.name}</p>
                                        <p className="text-sm font-medium text-slate-500 bg-slate-100 rounded-lg inline-block px-3 py-1">{shift.time}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center px-4">
                <button
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1 || loading}
                    className={`px-6 py-3 font-bold rounded-xl transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200 bg-slate-100'}`}
                >
                    الخطوة السابقة
                </button>

                {step < 4 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={
                            (step === 1 && !formData.name) ||
                            (step === 2 && !formData.curriculum) ||
                            (step === 3 && !formData.teacherId)
                        }
                        className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
                    >
                        التالي <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.shift || loading}
                        className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-[0_4px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'اعتماد وإنشاء الحلقة'}
                    </button>
                )}
            </div>
        </div>
    );
}
