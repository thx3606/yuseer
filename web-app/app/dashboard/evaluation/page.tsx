'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, Save, Star, AlertCircle, BookOpen, Volume2, Search, Target, User, RefreshCw, Layers } from 'lucide-react';
import axios from 'axios';

// TypeScript Interfaces based on our backend API payload
interface StudentProgress {
    currentSurah: number;
    currentJuz: number;
    currentPage: number;
    lastMemorizedVerse: string;
}

interface LastEvaluation {
    id: string;
    type: string;
    surah: number;
    fromAyah: number;
    toAyah: number;
    overallScore: number;
    date: string;
}

interface Student {
    id: string;
    name: string;
    studentCode: string;
    riwayah: string;
    progress: StudentProgress | null;
    lastEvaluation: LastEvaluation | null;
}

interface ClassData {
    id: string;
    name: string;
    level: string;
    students: Student[];
}

interface ShiftData {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    classes: ClassData[];
}

export default function TeacherEvaluationBoard() {
    const [shifts, setShifts] = useState<ShiftData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the Accordion UI
    const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
    const [activeClassId, setActiveClassId] = useState<string | null>(null);
    const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

    // Form states for the currently expanded student
    const [activeTab, setActiveTab] = useState<'memorization' | 'review' | 'tajweed' | 'mutoon'>('memorization');
    const [grade, setGrade] = useState(0);
    const [surah, setSurah] = useState('');
    const [fromAyah, setFromAyah] = useState('');
    const [toAyah, setToAyah] = useState('');
    const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
    const [teacherNotes, setTeacherNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // UI Helpers
    const [searchTerm, setSearchTerm] = useState('');

    const tajweedErrorsList = [
        'أحكام النون الساكنة والتنوين', 'أحكام الميم الساكنة', 'المدود',
        'القلقلة', 'مخارج الحروف', 'التفخيم والترقيق', 'الوقف والابتداء'
    ];

    useEffect(() => {
        fetchBoardData();
    }, []);

    const fetchBoardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/teachers/classes-board', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const data = res.data.data;
                setShifts(data);
                // Auto-expand the first shift and class if available
                if (data.length > 0) {
                    setActiveShiftId(data[0].id);
                    if (data[0].classes.length > 0) {
                        setActiveClassId(data[0].classes[0].id);
                    }
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في جلب بيانات الحلقات');
        } finally {
            setLoading(false);
        }
    };

    const toggleStudentAccordion = (student: Student) => {
        if (expandedStudentId === student.id) {
            setExpandedStudentId(null);
        } else {
            setExpandedStudentId(student.id);
            // Reset evaluation form
            setGrade(0);
            setSelectedErrors([]);
            setTeacherNotes('');

            // Auto-suggest next verse based on last evaluation
            if (student.lastEvaluation) {
                setSurah(student.lastEvaluation.surah.toString());
                setFromAyah((student.lastEvaluation.toAyah + 1).toString());
                setToAyah('');
            } else {
                setSurah('1'); // Fatiha default
                setFromAyah('1');
                setToAyah('');
            }
        }
    };

    const handleAutoSuggest = (student: Student) => {
        if (student.lastEvaluation) {
            setSurah(student.lastEvaluation.surah.toString());
            setFromAyah((student.lastEvaluation.toAyah + 1).toString());
            // Suggesting 5 ayahs forward as a naive default
            setToAyah((student.lastEvaluation.toAyah + 6).toString());
        }
    };

    const saveEvaluation = async (studentId: string) => {
        if (!grade || !surah || !fromAyah || !toAyah) {
            alert('الرجاء تعبئة السورة والآيات والدرجة.');
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/v1/evaluations/quran', {
                studentId,
                evaluationType: 'HIFZ_NEW',
                surah: parseInt(surah),
                fromAyah: parseInt(fromAyah),
                toAyah: parseInt(toAyah),
                overallScore: grade,
                tajweedErrors: selectedErrors,
                notes: teacherNotes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Mark visually as saved, refresh data
            setExpandedStudentId(null);
            fetchBoardData(); // Silently refresh the board to show updated last evaluation

        } catch (err) {
            alert('حدث خطأ أثناء الحفظ.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center p-12 text-primary font-bold"><RefreshCw className="animate-spin mr-3" /> جاري تحضير الحلقات...</div>;
    if (error) return <div className="text-red-500 p-8 text-center">{error}</div>;

    const activeShift = shifts.find(s => s.id === activeShiftId);
    const activeClass = activeShift?.classes.find(c => c.id === activeClassId);

    const filteredStudents = activeClass?.students.filter(s =>
        s.name.includes(searchTerm) || s.studentCode.includes(searchTerm)
    ) || [];

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] relative overflow-hidden">

            {/* Top Bar: Shift Selection */}
            <div className="bg-card border-b border-border/50 p-4 shrink-0 shadow-sm z-10 flex gap-4 overflow-x-auto">
                {shifts.map(shift => (
                    <button
                        key={shift.id}
                        onClick={() => { setActiveShiftId(shift.id); setActiveClassId(shift.classes[0]?.id); setExpandedStudentId(null); }}
                        className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeShiftId === shift.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                    >
                        <Layers className="w-5 h-5" />
                        {shift.name} ({shift.startTime})
                    </button>
                ))}
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Class Selection */}
                <div className="w-64 bg-card border-l border-border/50 p-4 shrink-0 overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4 text-muted-foreground">حلقات الفترة</h3>
                    <div className="space-y-2">
                        {activeShift?.classes.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => { setActiveClassId(cls.id); setExpandedStudentId(null); }}
                                className={`w-full text-right p-4 rounded-xl font-bold transition-all border ${activeClassId === cls.id ? 'border-primary bg-primary/5 text-primary' : 'border-transparent hover:bg-muted text-foreground'}`}
                            >
                                <div className="text-md">{cls.name}</div>
                                <div className="text-xs font-normal opacity-80 mt-1">{cls.students.length} طلاب</div>
                            </button>
                        ))}
                        {(!activeShift?.classes || activeShift.classes.length === 0) && (
                            <div className="text-sm text-center text-muted-foreground py-8">لا يوجد حلقات مسندة لك في هذه الفترة.</div>
                        )}
                    </div>
                </div>

                {/* Main Content: Students Accordion List */}
                <div className="flex-1 bg-slate-50 dark:bg-[#0a192f]/50 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-foreground">
                                {activeClass?.name} <span className="text-primary font-normal text-lg">({filteredStudents.length} طالب)</span>
                            </h2>
                            <div className="relative w-72">
                                <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="بحث السريع عن طالب..."
                                    className="w-full bg-card border border-border shadow-sm rounded-xl px-10 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Accordion List */}
                        <div className="space-y-4 pb-20">
                            {filteredStudents.map(student => {
                                const isExpanded = expandedStudentId === student.id;
                                const lastEval = student.lastEvaluation;

                                return (
                                    <div key={student.id} className={`bg-card rounded-3xl border shadow-sm overflow-hidden transition-all duration-300 ${isExpanded ? 'border-primary ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/50'}`}>

                                        {/* Accordion Header */}
                                        <button
                                            onClick={() => toggleStudentAccordion(student)}
                                            className="w-full p-5 flex items-center justify-between text-right focus:outline-none"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-foreground">{student.name}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">كود: {student.studentCode}</span>
                                                        {lastEval ? (
                                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                                آخر تسميع: سورة {lastEval.surah} (آية {lastEval.fromAyah}-{lastEval.toAyah}) - م {lastEval.overallScore}/5
                                                            </span>
                                                        ) : (
                                                            <span className="text-amber-600 dark:text-amber-400">لا يوجد تقييمات سابقة</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {/* Status dot could go here */}
                                                <ChevronDown className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                                            </div>
                                        </button>

                                        {/* Accordion Body */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className="border-t border-border/50 bg-slate-50/50 dark:bg-background/30"
                                                >
                                                    <div className="p-6">
                                                        <div className="flex gap-4 mb-6">
                                                            <button onClick={() => handleAutoSuggest(student)} className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                                                <RefreshCw className="w-4 h-4" /> أكمل من التالي تلقائياً
                                                            </button>
                                                        </div>

                                                        {/* Evaluation Form Grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                            <div>
                                                                <label className="text-sm font-bold block mb-2 text-muted-foreground">رقم السورة</label>
                                                                <input type="number" value={surah} onChange={e => setSurah(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="مثال: 2 (للبقرة)" />
                                                            </div>
                                                            <div>
                                                                <label className="text-sm font-bold block mb-2 text-muted-foreground">من آية</label>
                                                                <input type="number" value={fromAyah} onChange={e => setFromAyah(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" />
                                                            </div>
                                                            <div>
                                                                <label className="text-sm font-bold block mb-2 text-muted-foreground">إلى آية</label>
                                                                <input type="number" value={toAyah} onChange={e => setToAyah(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" />
                                                            </div>
                                                        </div>

                                                        <div className="mb-8">
                                                            <label className="text-sm font-bold block mb-4 text-muted-foreground">التقييم العام للحفظ</label>
                                                            <div className="flex gap-4">
                                                                {[5, 4, 3, 2, 1].map(g => (
                                                                    <button
                                                                        key={g}
                                                                        onClick={() => setGrade(g)}
                                                                        className={`flex-1 py-3 rounded-xl border transition-all font-bold text-lg ${grade === g ? 'bg-primary border-primary text-white shadow-lg scale-105' : 'bg-background border-border text-foreground hover:bg-muted'}`}
                                                                    >
                                                                        {g}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="mb-6">
                                                            <label className="text-sm font-bold block mb-3 text-muted-foreground">ملاحظات التجويد المخصصة</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {tajweedErrorsList.map(err => (
                                                                    <button
                                                                        key={err}
                                                                        onClick={() => setSelectedErrors(prev => prev.includes(err) ? prev.filter(e => e !== err) : [...prev, err])}
                                                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedErrors.includes(err) ? 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/40 dark:border-rose-700/50 dark:text-rose-300' : 'bg-background border-border text-muted-foreground'}`}
                                                                    >
                                                                        {err}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end pt-4 border-t border-border/50">
                                                            <button
                                                                onClick={() => saveEvaluation(student.id)}
                                                                disabled={isSaving}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-colors"
                                                            >
                                                                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                                                حفظ وانتقال للطالب التالي
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </div>
                                );
                            })}

                            {filteredStudents.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Target className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>لا يوجد طلاب حالياً أو لم يتم العثور على نتائج للبحث.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
