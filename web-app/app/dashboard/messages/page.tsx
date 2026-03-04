'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Paperclip, Send, User, Phone, Video, Users, Smile, Check, CheckCheck } from 'lucide-react';

const CONTACTS = [
    { id: 1, name: 'ولي أمر الطالب أحمد', role: 'ولي أمر', lastMessage: 'جزاكم الله خيراً على جهودكم', time: '10:30 ص', unread: 2, online: true },
    { id: 2, name: 'الشيخ محمد السالم', role: 'مشرف حلقات', lastMessage: 'تم إرسال تقرير الأداء الشهري', time: 'أمس', unread: 0, online: false },
    { id: 3, name: 'مجموعة معلمي العصر', role: 'مجموعة', lastMessage: 'موعد اجتماعنا اليوم بعد المغرب إن شاء الله', time: 'أمس', unread: 5, online: true },
    { id: 4, name: 'إدارة شؤون الطلاب', role: 'إدارة', lastMessage: 'الرجاء اعتماد شهادة الإجازة للطالب خالد', time: 'الأحد', unread: 0, online: true },
];

const MESSAGES = [
    { id: 1, text: 'السلام عليكم ورحمة الله وبركاته', sender: 'other', time: '10:15 ص', status: 'read' },
    { id: 2, text: 'وعليكم السلام ورحمة الله وبركاته، أهلاً بك أخي الكريم', sender: 'me', time: '10:20 ص', status: 'read' },
    { id: 3, text: 'أردت السؤال عن مستوى ابني أحمد في حفظ سورة البقرة، هل هو منتظم؟', sender: 'other', time: '10:22 ص', status: 'read' },
    { id: 4, text: 'نعم ولله الحمد، أحمد من الطلاب المتميزين وقد أتم حفظ 3 أحزاب بدرجة امتياز، نرجو لفت انتباهه فقط للمراجعة الدورية.', sender: 'me', time: '10:28 ص', status: 'delivered' },
    { id: 5, text: 'جزاكم الله خيراً على جهودكم', sender: 'other', time: '10:30 ص', status: 'sent' },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<number>(1);
    const [messageInput, setMessageInput] = useState('');

    const activeContact = CONTACTS.find(c => c.id === selectedChat);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden pb-0 mb-4">
            {/* قائمة المحادثات */}
            <div className="w-full md:w-80 lg:w-96 border-l border-border/50 flex flex-col bg-card/80">
                <div className="p-4 border-b border-border/50">
                    <h2 className="text-xl font-bold text-foreground mb-4">الرسائل</h2>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="بحث عن رسالة أو جهة اتصال..."
                            className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {CONTACTS.map((contact, idx) => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedChat(contact.id)}
                            className={`w-full text-right p-4 flex items-center gap-4 transition-colors border-b border-border/30 hover:bg-muted ${selectedChat === contact.id ? 'bg-muted/80' : ''
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${contact.role === 'مجموعة' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-primary/10 text-primary'
                                    }`}>
                                    {contact.role === 'مجموعة' ? <Users className="w-6 h-6" /> : contact.name.charAt(0)}
                                </div>
                                {contact.online && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card ring-1 ring-card" />
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-sm text-foreground truncate">{contact.name}</h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{contact.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground truncate max-w-[80%]">{contact.lastMessage}</p>
                                    {contact.unread > 0 && (
                                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* شاشة المحادثة */}
            <div className="flex-1 flex flex-col bg-[#f0f2f5] dark:bg-[#0a192f]/50 relative">
                {/* خلفية الزخرفة الإسلامية للمحادثة */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2310b981\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                {/* شريط علوي للمحادثة */}
                <div className="h-16 bg-card border-b border-border/50 px-6 flex items-center justify-between z-10 shadow-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${activeContact?.role === 'مجموعة' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                            {activeContact?.role === 'مجموعة' ? <Users className="w-5 h-5" /> : activeContact?.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-sm">{activeContact?.name}</h3>
                            <p className="text-xs text-primary">{activeContact?.online ? 'متصل الآن' : 'آخر ظهور أمس'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <button className="p-2 hover:bg-muted rounded-full transition-colors"><Search className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex"><Phone className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex"><Video className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-border mx-1"></div>
                        <button className="p-2 hover:bg-muted rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* منطقة الرسائل */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10">
                    {MESSAGES.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm relative ${msg.sender === 'me'
                                ? 'bg-primary text-primary-foreground rounded-tl-sm'
                                : 'bg-card text-foreground rounded-tr-sm border border-border/50'
                                }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <div className={`flex items-center gap-1 mt-2 text-[10px] ${msg.sender === 'me' ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground justify-end'}`}>
                                    <span>{msg.time}</span>
                                    {msg.sender === 'me' && (
                                        msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-blue-200" /> :
                                            msg.status === 'delivered' ? <CheckCheck className="w-3.5 h-3.5" /> :
                                                <Check className="w-3.5 h-3.5" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* منطقة الإدخال */}
                <div className="p-4 bg-card border-t border-border/50 z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <button className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors shrink-0">
                            <Smile className="w-6 h-6" />
                        </button>
                        <button className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors shrink-0">
                            <Paperclip className="w-6 h-6" />
                        </button>

                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="اكتب رسالتك هنا..."
                            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner text-foreground"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && messageInput.trim()) {
                                    setMessageInput('');
                                }
                            }}
                        />

                        <button
                            className={`p-3 rounded-xl flex items-center justify-center transition-all shrink-0 ${messageInput.trim()
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:scale-105'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-6 h-6 rtl:rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
