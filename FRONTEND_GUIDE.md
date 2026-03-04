# 🎨 دليل بناء واجهة المستخدم | Frontend Development Guide

---

## 📋 نظرة عامة

واجهة المستخدم للنظام ستُبنى باستخدام **Next.js 14** مع **TypeScript** و **Tailwind CSS**، مع التركيز على:

- ✅ تجربة مستخدم سلسة وبديهية
- ✅ دعم كامل للغة العربية (RTL)
- ✅ تصميم متجاوب (Responsive)
- ✅ أداء عالي
- ✅ إمكانية الوصول (Accessibility)

---

## 🏗️ هيكل المشروع المقترح

```
frontend/
├── public/                      # الملفات الثابتة
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── src/
│   ├── app/                     # Next.js 14 App Router
│   │   ├── (auth)/             # مجموعة المصادقة
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (dashboard)/        # مجموعة لوحة التحكم
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # الصفحة الرئيسية
│   │   │   │
│   │   │   ├── students/       # إدارة الطلاب
│   │   │   ├── teachers/       # إدارة المعلمين
│   │   │   ├── classes/        # إدارة الفصول
│   │   │   ├── evaluations/    # التقييمات
│   │   │   ├── exams/          # الاختبارات
│   │   │   ├── messages/       # الرسائل
│   │   │   ├── reports/        # التقارير
│   │   │   ├── certificates/   # الشهادات
│   │   │   └── settings/       # الإعدادات
│   │   │
│   │   ├── layout.tsx          # Layout الرئيسي
│   │   └── page.tsx            # الصفحة الرئيسية العامة
│   │
│   ├── components/              # المكونات القابلة لإعادة الاستخدام
│   │   ├── ui/                 # مكونات Shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/             # مكونات التخطيط
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Breadcrumb.tsx
│   │   │
│   │   ├── students/           # مكونات الطلاب
│   │   │   ├── StudentCard.tsx
│   │   │   ├── StudentList.tsx
│   │   │   ├── StudentForm.tsx
│   │   │   └── StudentProgress.tsx
│   │   │
│   │   ├── evaluations/        # مكونات التقييم
│   │   │   ├── QuranEvaluationForm.tsx
│   │   │   ├── EvaluationCard.tsx
│   │   │   └── TajweedErrorInput.tsx
│   │   │
│   │   ├── messages/           # مكونات الرسائل
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageCard.tsx
│   │   │   └── ComposeMessage.tsx
│   │   │
│   │   └── shared/             # مكونات مشتركة
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── PageHeader.tsx
│   │
│   ├── lib/                     # مكتبات مساعدة
│   │   ├── api.ts              # إعدادات Axios
│   │   ├── auth.ts             # مساعدات المصادقة
│   │   ├── utils.ts            # دوال مساعدة
│   │   ├── validators.ts       # Zod Schemas
│   │   └── constants.ts        # الثوابت
│   │
│   ├── hooks/                   # React Hooks مخصصة
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useStudents.ts
│   │   ├── useEvaluations.ts
│   │   ├── useMessages.ts
│   │   └── useNotifications.ts
│   │
│   ├── services/                # خدمات API
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── teacher.service.ts
│   │   ├── evaluation.service.ts
│   │   ├── message.service.ts
│   │   └── report.service.ts
│   │
│   ├── store/                   # إدارة الحالة (Zustand)
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── types/                   # أنواع TypeScript
│   │   ├── user.types.ts
│   │   ├── student.types.ts
│   │   ├── evaluation.types.ts
│   │   └── api.types.ts
│   │
│   └── styles/                  # ملفات الأنماط
│       ├── globals.css
│       └── rtl.css
│
├── .env.local                   # متغيرات البيئة المحلية
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 نظام الألوان المقترح

### الألوان الأساسية

```css
:root {
  /* الأخضر الإسلامي */
  --primary: 142 76% 36%;        /* #16a34a */
  --primary-foreground: 0 0% 100%;

  /* الذهبي */
  --accent: 45 93% 47%;          /* #f59e0b */
  --accent-foreground: 0 0% 0%;

  /* الخلفيات */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* الثانوية */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* الحدود */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;

  /* الكروت */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* التنبيهات */
  --destructive: 0 84.2% 60.2%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 221 83% 53%;
}
```

---

## 📱 الصفحات الرئيسية

### 1. صفحات المصادقة

#### صفحة تسجيل الدخول (`/login`)
```typescript
// Features:
- نموذج تسجيل دخول بسيط
- خيار "تذكرني"
- رابط "نسيت كلمة المرور"
- دعم RTL كامل
- رسائل الخطأ بالعربية
```

#### صفحة التسجيل (`/register`)
```typescript
// Features:
- نموذج متعدد الخطوات
- التحقق من البيانات (Zod)
- اختيار نوع الحساب
- تأكيد البريد الإلكتروني
```

### 2. لوحة التحكم الرئيسية (`/dashboard`)

```typescript
// Sections:
✅ إحصائيات سريعة (Cards):
   - عدد الطلاب النشطين
   - عدد المعلمين
   - معدل الحضور
   - التقييمات الأخيرة

✅ الرسوم البيانية:
   - تقدم الحفظ الشهري
   - توزيع الطلاب حسب المستوى
   - معدلات الحضور

✅ الأنشطة الأخيرة:
   - آخر التقييمات
   - الرسائل الجديدة
   - الاختبارات القادمة
```

### 3. إدارة الطلاب (`/dashboard/students`)

#### قائمة الطلاب
```typescript
// Features:
- جدول مع ترقيم الصفحات
- البحث والفلترة
- الفرز حسب الحقول
- عرض سريع للمعلومات
- إجراءات سريعة (تعديل، حذف، عرض)
```

#### ملف الطالب (`/dashboard/students/[id]`)
```typescript
// Tabs:
1. المعلومات الشخصية
2. التقدم في الحفظ (Progress)
3. التقييمات
4. الحضور
5. الشهادات
```

### 4. التقييمات (`/dashboard/evaluations`)

#### إنشاء تقييم جديد
```typescript
// Form Sections:
1. اختيار الطالب
2. نوع التقييم
3. نطاق التقييم (سورة، صفحة، جزء)
4. الدرجات:
   - التجويد (Slider 0-100)
   - الحفظ (Slider 0-100)
   - الطلاقة (Slider 0-100)
5. أخطاء التجويد (Dynamic List)
6. ملاحظات
7. رفع تسجيل صوتي (اختياري)
```

### 5. نظام الرسائل (`/dashboard/messages`)

```typescript
// Layout:
├── Sidebar: قائمة المحادثات
├── Main: منطقة الرسائل
└── Compose: إنشاء رسالة جديدة

// Features:
- بحث في الرسائل
- تصنيف (وارد، مرسل، مسودات)
- إشعارات فورية (Socket.io)
- رسائل جماعية
```

### 6. التقارير (`/dashboard/reports`)

```typescript
// Report Types:
1. تقرير يومي
2. تقرير أسبوعي
3. تقرير شهري
4. تقرير سنوي
5. تقرير حسب الجنسيات
6. تقرير حسب الأعمار

// Export Options:
- PDF
- Excel
- CSV
```

---

## 🛠️ مكونات Shadcn/ui المستخدمة

```bash
# تثبيت المكونات الأساسية
npx shadcn-ui@latest init

npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
```

---

## 🔐 نظام المصادقة (Frontend)

### Hook مخصص للمصادقة

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return { user, loading, login, logout };
};
```

---

## 📊 مثال على مكون إحصائيات

```typescript
// components/dashboard/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 ml-1" />
              <span className="text-green-600">{trend}%</span>
              <span className="text-muted-foreground mr-1">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className="text-primary">{icon}</div>
      </div>
    </Card>
  );
};
```

---

## 🌐 دعم اللغة العربية (RTL)

### إعدادات Tailwind

```javascript
// tailwind.config.ts
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### CSS للـ RTL

```css
/* styles/rtl.css */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .ml-auto {
  margin-left: 0;
  margin-right: auto;
}

[dir="rtl"] .mr-auto {
  margin-right: 0;
  margin-left: auto;
}
```

---

## 📦 الحزم المطلوبة

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "@radix-ui/react-icons": "^1.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "axios": "^1.6.5",
    "react-query": "^3.39.3",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "date-fns": "^3.3.1",
    "recharts": "^2.10.4",
    "socket.io-client": "^4.6.1",
    "react-hot-toast": "^2.4.1",
    "next-themes": "^0.2.1"
  }
}
```

---

## 🎯 أولويات التطوير

### المرحلة الأولى (أساسي)
1. ✅ نظام المصادقة (Login/Register)
2. ✅ لوحة التحكم الرئيسية
3. ✅ إدارة الطلاب (CRUD)
4. ✅ نظام التقييمات

### المرحلة الثانية (أساسي +)
5. ✅ نظام الرسائل
6. ✅ التقارير الأساسية
7. ✅ الإشعارات

### المرحلة الثالثة (متقدم)
8. ✅ نظام الاختبارات
9. ✅ إصدار الشهادات
10. ✅ التقارير المتقدمة

---

## 📝 ملاحظات مهمة

1. **الأداء**: استخدم Next.js Image component للصور
2. **SEO**: استخدم Metadata API في Next.js 14
3. **الإمكانية**: اتبع معايير WCAG 2.1
4. **الاختبار**: اكتب اختبارات باستخدام Jest و React Testing Library
5. **التوثيق**: وثّق المكونات باستخدام Storybook

---

**هذا مخطط شامل لبناء واجهة المستخدم. يمكن البدء بتطوير المرحلة الأولى!** 🚀
