'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, Save, Star, AlertCircle, BookOpen, Volume2, Search, Target, User } from 'lucide-react';
import Link from 'next/link';

export default function EvaluationPage() {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(1);
    const [activeTab, setActiveTab] = useState<'memorization' | 'review' | 'tajweed' | 'mutoon'>('memorization');
    const [grade, setGrade] = useState(0);

    const students = [
        { id: 1, name: 'عبدالرحمن محمد العبدالله', avatar: 'ع', status: 'present', progress: 45 },
        { id: 2, name: 'صالح عبدالعزيز السالم', avatar: 'ص', status: 'present', progress: 80 },
        { id: 3, name: 'فيصل عبدالرحمن القحطاني', avatar: 'ف', status: 'absent', progress: 60 },
        { id: 4, name: 'محمد سعد الشهراني', avatar: 'م', status: 'present', progress: 95 },
    ];

    const tajweedErrors = [
        'أحكام النون الساكنة والتنوين',
        'أحكام الميم الساكنة',
        'المدود',
        'القلقلة',
        'مخارج الحروف',
        'التفخيم والترقيق'
    ];

    const [selectedErrors, setSelectedErrors] = useState<string[]>([]);

    const toggleError = (error: string) => {
        if (selectedErrors.includes(error)) {
            setSelectedErrors(selectedErrors.filter(e => e !== error));
        } else {
            setSelectedErrors([...selectedErrors, error]);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6 pb-6">
            {/* القائمة الجانبية للطلاب */}
            <div className="w-full lg:w-80 bg-card border border-border/50 rounded-3xl shadow-sm flex flex-col overflow-hidden flex-shrink-0">
                <div className="p-4 border-b border-border/50 bg-card/50">
                    <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                        طلاب الحلقة
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">12 طالب</span>
                    </h3>
                    <div className="relative">
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="بحث عن طالب..."
                            className="w-full bg-background border border-border rounded-xl px-10 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {students.map((student) => (
                        <button
                            key={student.id}
                            onClick={() => setSelectedStudent(student.id)}
                            className={`w-full text-right flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedStudent === student.id
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                : 'hover:bg-muted text-foreground'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${selectedStudent === student.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                                }`}>
                                {student.avatar}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-sm truncate">{student.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${student.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className={`text-xs ${selectedStudent === student.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                        {student.status === 'present' ? 'حاضر' : 'غائب'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* منطقة التقييم الأساسية */}
            <div className="flex-1 bg-card border border-border/50 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
                {selectedStudent ? (
                    <>
                        <div className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-sm z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20">
                                    {students.find(s => s.id === selectedStudent)?.avatar}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{students.find(s => s.id === selectedStudent)?.name}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">الحفظ الحالي: سورة البقرة - 45%</p>
                                </div>
                            </div>
                            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 w-full sm:w-auto justify-center">
                                <Save className="w-5 h-5" />
                                حفظ التقييم اليومي
                            </button>
                        </div>

                        {/* شريط التبويبات */}
                        <div className="flex border-b border-border/50 px-6 overflow-x-auto hide-scrollbar">
                            {[
                                { id: 'memorization', label: 'الحفظ الجديد', icon: BookOpen },
                                { id: 'review', label: 'المراجعة', icon: Target },
                                { id: 'tajweed', label: 'التجويد', icon: Volume2 },
                                { id: 'mutoon', label: 'المتون العلمية', icon: Star }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* نموذج التقييم (متغير حسب التبويب) */}
                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-[#0a192f]/50">
                            <AnimatePresence mode="wait">
                                {activeTab === 'memorization' && (
                                    <motion.div
                                        key="memorization"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8 max-w-2xl mx-auto"
                                    >
                                        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                                            <h4 className="font-bold text-lg mb-4 text-foreground">المقرر اليومي للحفظ</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm text-muted-foreground block mb-2">من سورة / آية</label>
                                                    <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="البقرة - 142" />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-muted-foreground block mb-2">إلى سورة / آية</label>
                                                    <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="البقرة - 150" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm text-center">
                                            <h4 className="font-bold text-lg mb-6 text-foreground">تقييم الأداء والمستوى</h4>
                                            <div className="flex justify-between items-center max-w-md mx-auto">
                                                {[
                                                    { grade: 5, label: 'ممتاز' },
                                                    { grade: 4, label: 'جيد جداً' },
                                                    { grade: 3, label: 'جيد' },
                                                    { grade: 2, label: 'مقبول' },
                                                    { grade: 1, label: 'ضعيف' }
                                                ].map((item) => (
                                                    <button
                                                        key={item.grade}
                                                        onClick={() => setGrade(item.grade)}
                                                        className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${grade === item.grade
                                                            ? 'bg-primary/10 text-primary scale-110 shadow-lg shadow-primary/10'
                                                            : 'hover:bg-muted text-muted-foreground grayscale'
                                                            }`}
                                                    >
                                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${grade === item.grade ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800'
                                                            }`}>
                                                            {item.grade === 5 ? <Star className="w-6 h-6 fill-current" /> :
                                                                item.grade === 4 ? <CheckCircle2 className="w-6 h-6" /> :
                                                                    item.grade === 1 ? <AlertCircle className="w-6 h-6" /> :
                                                                        <span className="font-bold text-xl">{item.grade}</span>}
                                                        </div>
                                                        <span className="font-bold text-sm">{item.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'tajweed' && (
                                    <motion.div
                                        key="tajweed"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6 max-w-3xl mx-auto"
                                    >
                                        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                                            <h4 className="font-bold text-lg mb-6 text-foreground">الملاحظات التجويدية (انقر للاختيار)</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {tajweedErrors.map((error, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => toggleError(error)}
                                                        className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${selectedErrors.includes(error)
                                                            ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                                                            : 'bg-background border-border text-foreground hover:bg-muted'
                                                            }`}
                                                    >
                                                        {error}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="mt-8">
                                                <label className="text-sm font-bold text-foreground block mb-3">ملاحظات إضافية</label>
                                                <textarea
                                                    className="w-full bg-background border border-border rounded-xl p-4 focus:outline-none focus:border-primary resize-none h-32"
                                                    placeholder="اكتب ملاحظاتك الصوتية أو التوجيهية للطالب هنا لمراجعتها لاحقاً..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
                        <User className="w-20 h-20 mb-4 opacity-20" />
                        <h2 className="text-xl font-bold mb-2">الرجاء اختيار طالب للحلقة</h2>
                        <p>اختر أحد الطلاب من القائمة الجانبية لبدء التقييم اليومي لسير الحفظ والمراجعة.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
