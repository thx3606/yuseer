# نظام إدارة مدارس تحفيظ القرآن الكريم - SaaS Multi-Tenant
# Quranic Schools Management System - Complete Platform Specification
# الجزء الثاني - Part 2

---

## 6. تصميم واجهة المستخدم والتجربة | UI/UX Design (تابع)

### 6.3 الشاشات الرئيسية | Main Screens

#### أ. لوحة تحكم مالك المنصة | Platform Owner Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ 🕌 نظام إدارة مدارس تحفيظ القرآن الكريم       👤 Admin ▼  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  الشريط الجانبي:                   المحتوى الرئيسي:        │
│  ├─ 📊 Dashboard                   ┌──────────────────────┐ │
│  ├─ 🏢 Tenants                     │ إحصائيات عامة        │ │
│  ├─ 💳 Subscriptions               │                      │ │
│  ├─ 📈 Analytics                   │ ┌────┐ ┌────┐ ┌────┐ │ │
│  ├─ 💰 Revenue                     │ │250 │ │45K │ │98% │ │ │
│  ├─ 🔔 System Alerts               │ │جهة │ │طالب│ │نشط │ │ │
│  ├─ ⚙️ Settings                    │ └────┘ └────┘ └────┘ │ │
│  └─ 📚 Documentation               │                      │ │
│                                    └──────────────────────┘ │
│                                    ┌──────────────────────┐ │
│                                    │ الجهات الأكثر نشاطاً │ │
│                                    │ ┌──────────────────┐ │ │
│                                    │ │ 1. جمعية البر    │ │ │
│                                    │ │    2,500 طالب    │ │ │
│                                    │ │ 2. جمعية الخير  │ │ │
│                                    │ │    1,200 طالب    │ │ │
│                                    │ └──────────────────┘ │ │
│                                    └──────────────────────┘ │
│                                    ┌──────────────────────┐ │
│                                    │ رسم بياني للإيرادات │ │
│                                    │      ────────         │ │
│                                    │     /        \        │ │
│                                    │    /          \       │ │
│                                    │   /            ──     │ │
│                                    └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**المكونات الرئيسية:**
- **KPI Cards**: عدد الجهات، إجمالي الطلاب، معدل النشاط، الإيرادات الشهرية
- **Activity Chart**: رسم بياني لنشاط المنصة على مدار 30 يوم
- **Tenants Table**: قائمة بجميع الجهات مع حالة الاشتراك والتفعيل
- **Revenue Analytics**: تحليلات الإيرادات والمدفوعات
- **System Health**: مؤشرات صحة النظام (Database, Cache, Storage)

#### ب. لوحة تحكم مدير الجهة | Tenant Admin Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ 🕌 جمعية البر لتحفيظ القرآن الكريم    👤 أحمد المدير ▼    │
├─────────────────────────────────────────────────────────────┤
│ القائمة الجانبية:                    لوحة المعلومات:       │
│                                                             │
│ 📊 لوحة المعلومات                  ┌────────────────────┐  │
│ 👥 الطلاب (850)                    │ الإحصائيات اليومية │  │
│ 👨‍🏫 المعلمون (45)                   │                    │  │
│ 📚 الحلقات (32)                    │ الحضور اليوم:      │  │
│ 📝 التقييمات                       │ ████████░░ 85%      │  │
│ 📋 الاختبارات                      │                    │  │
│ 📊 التقارير                        │ التسميع المنجز:    │  │
│ 💬 الرسائل                         │ ██████░░░░ 62%      │  │
│ 🔔 الإشعارات (12)                  │                    │  │
│ 📜 الشهادات                        │ الواجبات:          │  │
│ 💰 المدفوعات                       │ ███████░░░ 78%      │  │
│ ⚙️ الإعدادات                       └────────────────────┘  │
│                                                             │
│                                     ┌────────────────────┐  │
│                                     │ الطلاب المتميزون   │  │
│                                     │ 🏆 محمد أحمد       │  │
│                                     │    حفظ 15 جزء      │  │
│                                     │ 🏆 فاطمة علي       │  │
│                                     │    حفظ 10 أجزاء    │  │
│                                     └────────────────────┘  │
│                                                             │
│                                     ┌────────────────────┐  │
│                                     │ التنبيهات الهامة   │  │
│                                     │ ⚠️ 5 طلاب غائبون  │  │
│                                     │ ⚠️ 3 اختبارات قادمة│  │
│                                     └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**المكونات الرئيسية:**
- **Overview Cards**: عدد الطلاب، المعلمين، الحلقات، نسبة الحضور
- **Attendance Chart**: رسم بياني للحضور على مدار الأسبوع
- **Recent Activities**: آخر الأنشطة (تسجيلات، تقييمات، رسائل)
- **Upcoming Events**: الاختبارات والفعاليات القادمة
- **Quick Actions**: إضافة طالب، إنشاء حلقة، إرسال إشعار

#### ج. بوابة المعلم | Teacher Portal

```
┌─────────────────────────────────────────────────────────────┐
│ 🕌 الحلقات الخاصة بي                👤 الأستاذ خالد ▼     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ القائمة:                           الحلقات النشطة:         │
│                                                             │
│ 📚 حلقاتي (3)                     ┌─────────────────────┐  │
│ 📝 التسميع اليومي                 │ حلقة النور - صباحي  │  │
│ 📊 سجل الحضور                     │ 👥 25 طالب          │  │
│ 🎯 تقييم الطلاب                   │ 📅 الأحد-الخميس     │  │
│ 📋 الاختبارات                     │ ⏰ 8:00 - 10:00 ص  │  │
│ 💬 رسائل أولياء الأمور            │ [بدء التسميع] [حضور]│  │
│ 📈 تقاريري                        └─────────────────────┘  │
│ 📜 الشهادات                                               │
│                                    ┌─────────────────────┐  │
│                                    │ التسميع اليوم       │  │
│                                    │                     │  │
│                                    │ □ محمد أحمد        │  │
│                                    │   سورة البقرة 1-10 │  │
│                                    │                     │  │
│                                    │ ✓ علي حسن           │  │
│                                    │   سورة آل عمران 5  │  │
│                                    │   ممتاز 95%         │  │
│                                    │                     │  │
│                                    │ □ فاطمة محمد        │  │
│                                    │   سورة النساء 1-3  │  │
│                                    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**المكونات الرئيسية:**
- **My Classes Card**: قائمة الحلقات مع عدد الطلاب والمواعيد
- **Daily Tasmee3 Checklist**: قائمة الطلاب المقرر تسميعهم اليوم
- **Attendance Tracker**: تسجيل الحضور السريع
- **Evaluation Form**: نموذج تقييم التسميع (Tajweed errors, Memorization level)
- **Student Progress View**: عرض تقدم كل طالب على حدة

#### د. بوابة الطالب/ولي الأمر | Student/Parent Portal

```
┌─────────────────────────────────────────────────────────────┐
│ 🕌 تقدم الطالب: محمد أحمد             👤 والد الطالب ▼    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ القائمة:                           ملخص الأداء:            │
│                                                             │
│ 📊 لوحة المعلومات                 ┌─────────────────────┐  │
│ 📚 الحلقة                         │ إجمالي الحفظ:       │  │
│ 📝 التسميع                        │ █████████████░░░░░░ │  │
│ 📋 الاختبارات                     │ 15 جزء من 30       │  │
│ 📈 التقارير                       └─────────────────────┘  │
│ 💬 الرسائل                                                 │
│ 🔔 الإشعارات (3)                  ┌─────────────────────┐  │
│ 📜 الشهادات                       │ آخر تقييم:          │  │
│                                    │ سورة البقرة 50-60  │  │
│                                    │ التجويد: ⭐⭐⭐⭐⭐   │  │
│                                    │ الحفظ: ⭐⭐⭐⭐☆      │  │
│                                    │ الطلاقة: ⭐⭐⭐⭐⭐    │  │
│                                    └─────────────────────┘  │
│                                                             │
│                                    ┌─────────────────────┐  │
│                                    │ الحضور (30 يوم):    │  │
│                                    │ ✓✓✓✓✓✓ ✓✓✓✓✓✓      │  │
│                                    │ ✓✓✓✓✓✓ ✓✓✓✓✓✓      │  │
│                                    │ ✓✓✓✓×✓ ✓✓✓✓✓✓      │  │
│                                    │ نسبة الحضور: 96%   │  │
│                                    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**المكونات الرئيسية:**
- **Progress Overview**: إجمالي الحفظ، نسبة الإتقان، عدد الأجزاء المحفوظة
- **Latest Evaluation**: آخر تقييم مع التفاصيل (Tajweed, Memorization, Fluency)
- **Attendance Calendar**: تقويم الحضور مع الإحصائيات
- **Upcoming Exams**: الاختبارات القادمة مع المقرر
- **Messages from Teacher**: رسائل المعلم وملاحظاته

#### ه. تطبيق الجوال | Mobile App Screens

**1. شاشة تسجيل الدخول | Login Screen**
```
╔═════════════════════════╗
║                         ║
║    🕌                   ║
║   نظام تحفيظ القرآن     ║
║                         ║
║  ┌─────────────────┐   ║
║  │ 📧 البريد       │   ║
║  └─────────────────┘   ║
║                         ║
║  ┌─────────────────┐   ║
║  │ 🔒 كلمة المرور  │   ║
║  └─────────────────┘   ║
║                         ║
║  [ تذكرني ]            ║
║                         ║
║  ┌─────────────────┐   ║
║  │   دخول          │   ║
║  └─────────────────┘   ║
║                         ║
║  نسيت كلمة المرور؟     ║
║                         ║
╚═════════════════════════╝
```

**2. الشاشة الرئيسية للمعلم | Teacher Home**
```
╔═════════════════════════╗
║ 👤 الأستاذ خالد    🔔  ║
╠═════════════════════════╣
║ حلقاتي اليوم:           ║
║                         ║
║ ┌─────────────────────┐ ║
║ │ حلقة النور          │ ║
║ │ ⏰ 8:00-10:00 ص    │ ║
║ │ 👥 25 طالب         │ ║
║ │ [بدء التسميع]      │ ║
║ └─────────────────────┘ ║
║                         ║
║ ┌─────────────────────┐ ║
║ │ حلقة الهداية        │ ║
║ │ ⏰ 4:00-6:00 م     │ ║
║ │ 👥 18 طالب         │ ║
║ │ [بدء التسميع]      │ ║
║ └─────────────────────┘ ║
║                         ║
║ إحصائيات سريعة:         ║
║ ✓ 22 تسميع اليوم       ║
║ ✓ 95% نسبة الحضور     ║
║                         ║
╠═════════════════════════╣
║  [🏠] [📚] [📝] [💬]   ║
╚═════════════════════════╝
```

**3. شاشة التسميع | Tasmee3 Screen**
```
╔═════════════════════════╗
║ ← التسميع               ║
╠═════════════════════════╣
║ الطالب: محمد أحمد       ║
║ المقرر: البقرة 1-10    ║
║                         ║
║ ┌─────────────────────┐ ║
║ │ التجويد:            │ ║
║ │ ⭐⭐⭐⭐⭐           │ ║
║ └─────────────────────┘ ║
║                         ║
║ ┌─────────────────────┐ ║
║ │ الحفظ:              │ ║
║ │ ⭐⭐⭐⭐☆           │ ║
║ └─────────────────────┘ ║
║                         ║
║ ┌─────────────────────┐ ║
║ │ الطلاقة:            │ ║
║ │ ⭐⭐⭐⭐⭐           │ ║
║ └─────────────────────┘ ║
║                         ║
║ الأخطاء:                ║
║ □ مد                    ║
║ ☑ غنة                  ║
║ □ إدغام                ║
║                         ║
║ ملاحظات:                ║
║ ┌─────────────────────┐ ║
║ │ أداء ممتاز...       │ ║
║ └─────────────────────┘ ║
║                         ║
║ [حفظ التقييم]          ║
╚═════════════════════════╝
```

**4. شاشة ولي الأمر | Parent View**
```
╔═════════════════════════╗
║ 👤 والد محمد       🔔  ║
╠═════════════════════════╣
║ تقدم الطالب:            ║
║                         ║
║ ┌─────────────────────┐ ║
║ │ الحفظ الإجمالي:     │ ║
║ │ ████████████░░░░░░  │ ║
║ │ 15 جزء من 30       │ ║
║ └─────────────────────┘ ║
║                         ║
║ ┌─────────────────────┐ ║
║ │ آخر تقييم:          │ ║
║ │ سورة البقرة 50-60  │ ║
║ │ ممتاز ⭐⭐⭐⭐⭐      │ ║
║ │ منذ يومين           │ ║
║ └─────────────────────┘ ║
║                         ║
║ الحضور هذا الأسبوع:     ║
║ الأحد    ✓             ║
║ الاثنين  ✓             ║
║ الثلاثاء ✓             ║
║ الأربعاء ✓             ║
║ الخميس   ×             ║
║                         ║
║ [عرض التقرير الكامل]   ║
╠═════════════════════════╣
║  [🏠] [📊] [💬] [⚙️]  ║
╚═════════════════════════╝
```

### 6.4 تدفقات المستخدم | User Flows

#### تدفق التسميع اليومي | Daily Tasmee3 Flow

```
1. المعلم يفتح التطبيق
   ↓
2. يختار الحلقة
   ↓
3. يضغط "بدء التسميع"
   ↓
4. يظهر قائمة الطلاب المقرر تسميعهم
   ↓
5. يختار طالب
   ↓
6. يبدأ الطالب بالتسميع
   ↓
7. المعلم يقيّم (التجويد، الحفظ، الطلاقة)
   ↓
8. يسجل الأخطاء إن وجدت
   ↓
9. يكتب ملاحظات
   ↓
10. يحفظ التقييم
    ↓
11. النظام يرسل إشعار لولي الأمر تلقائياً
    ↓
12. النظام يحدث سجل تقدم الطالب
```

#### تدفق إنشاء اختبار | Exam Creation Flow

```
1. المعلم/المشرف يختار "إنشاء اختبار"
   ↓
2. يحدد نوع الاختبار (شفهي/تحريري/عملي)
   ↓
3. يحدد الحلقة أو المستوى
   ↓
4. يحدد المقرر (من-إلى)
   ↓
5. يحدد التاريخ والوقت
   ↓
6. يحدد المدة الزمنية
   ↓
7. يحدد معايير التقييم والدرجات
   ↓
8. يراجع التفاصيل
   ↓
9. يحفظ الاختبار
   ↓
10. النظام يرسل إشعارات للطلاب وأولياء الأمور
    ↓
11. يظهر الاختبار في جدول الاختبارات
```

#### تدفق إصدار شهادة | Certificate Issuance Flow

```
1. المشرف يختار "إصدار شهادة"
   ↓
2. يختار نوع الشهادة (حفظ جزء/حفظ كامل/إجازة)
   ↓
3. يختار الطالب
   ↓
4. النظام يتحقق من استيفاء الشروط
   ↓
5. يعرض معاينة الشهادة
   ↓
6. المشرف يراجع البيانات
   ↓
7. يوافق على الإصدار
   ↓
8. النظام يولد الشهادة (PDF + QR Code)
   ↓
9. يرسل نسخة للطالب وولي الأمر
   ↓
10. يحفظ في سجل الشهادات
```

---

## 7. نظام التقييم والدرجات | Grading System

### 7.1 منهجية التقييم | Evaluation Methodology

#### أ. تقييم تحفيظ القرآن الكريم | Quran Memorization Evaluation

**1. معايير التقييم الثلاثة:**

```javascript
{
  "tajweed": {
    "weight": 40,
    "description": "التجويد وأحكام التلاوة",
    "criteria": [
      "أحكام النون الساكنة والتنوين",
      "أحكام الميم الساكنة",
      "المدود",
      "أحكام الراء واللام",
      "الوقف والابتداء"
    ]
  },
  "memorization": {
    "weight": 40,
    "description": "جودة الحفظ",
    "criteria": [
      "دقة الحفظ",
      "قلة الأخطاء",
      "عدم التلقين",
      "الاستقلالية في التسميع"
    ]
  },
  "fluency": {
    "weight": 20,
    "description": "الطلاقة والانسيابية",
    "criteria": [
      "سرعة التسميع",
      "عدم التوقف",
      "الثقة",
      "جمال الصوت"
    ]
  }
}
```

**2. سلم التقييم | Grading Scale:**

```
ممتاز (Excellent)    : 95-100%  ⭐⭐⭐⭐⭐
جيد جداً (Very Good)  : 85-94%   ⭐⭐⭐⭐
جيد (Good)           : 75-84%   ⭐⭐⭐
مقبول (Pass)         : 60-74%   ⭐⭐
ضعيف (Weak)          : 50-59%   ⭐
راسب (Fail)          : < 50%    ×
```

**3. أخطاء التجويد المسجلة | Tajweed Errors Tracked:**

```typescript
enum TajweedErrorType {
  // أحكام النون الساكنة والتنوين
  IDHAAR = "إظهار",
  IDGHAAM = "إدغام",
  IQLAAB = "إقلاب",
  IKHFAA = "إخفاء",

  // أحكام المدود
  MADD_TABEE3I = "مد طبيعي",
  MADD_MUTTASIL = "مد متصل",
  MADD_MUNFASIL = "مد منفصل",
  MADD_LAAZIM = "مد لازم",

  // أحكام الميم الساكنة
  IKHFAA_SHAFAWI = "إخفاء شفوي",
  IDGHAAM_MITHLAYN = "إدغام مثلين",

  // أحكام الراء
  TAFKHEEM = "تفخيم",
  TARQEEQ = "ترقيق",

  // أحكام القلقلة
  QALQALA = "قلقلة",

  // الغنة
  GHUNNAH = "غنة",

  // الوقف والابتداء
  WAQF = "وقف",
  IBTIDAA = "ابتداء",

  // أخرى
  INCORRECT_PRONUNCIATION = "نطق خاطئ",
  WRONG_HARAKAT = "حركات خاطئة"
}
```

**4. حساب الدرجة النهائية | Final Score Calculation:**

```typescript
function calculateQuranScore(evaluation: QuranEvaluation): number {
  // 1. حساب درجة التجويد (40%)
  const tajweedScore = calculateTajweedScore(evaluation);

  // 2. حساب درجة الحفظ (40%)
  const memorizationScore = calculateMemorizationScore(evaluation);

  // 3. حساب درجة الطلاقة (20%)
  const fluencyScore = evaluation.fluencyScore || 100;

  // 4. حساب الدرجة النهائية
  const finalScore = (
    (tajweedScore * 0.4) +
    (memorizationScore * 0.4) +
    (fluencyScore * 0.2)
  );

  return Math.round(finalScore * 100) / 100;
}

function calculateTajweedScore(evaluation: QuranEvaluation): number {
  const baseScore = evaluation.tajweedScore || 100;
  const errorCount = evaluation.errors?.length || 0;

  // خصم نقاط على كل خطأ تجويد
  const deduction = errorCount * 2; // 2 نقطة لكل خطأ

  return Math.max(0, baseScore - deduction);
}

function calculateMemorizationScore(evaluation: QuranEvaluation): number {
  const baseScore = evaluation.memorizationScore || 100;
  const mistakeCount = evaluation.mistakeCount || 0;

  // خصم نقاط على كل خطأ حفظ
  const deduction = mistakeCount * 3; // 3 نقاط لكل خطأ

  return Math.max(0, baseScore - deduction);
}
```

#### ب. تقييم المتون | Mutoon Evaluation

```typescript
interface MutoonEvaluation {
  accuracy: number;        // دقة الحفظ (40%)
  understanding: number;   // الفهم (30%)
  tajweed: number;        // التجويد (20%)
  presentation: number;   // العرض والأداء (10%)
}

function calculateMutoonScore(evaluation: MutoonEvaluation): number {
  return (
    (evaluation.accuracy * 0.4) +
    (evaluation.understanding * 0.3) +
    (evaluation.tajweed * 0.2) +
    (evaluation.presentation * 0.1)
  );
}
```

#### ج. تقييم النورانية | Noorani Qaida Evaluation

```typescript
interface NooraniEvaluation {
  letterRecognition: number;  // التعرف على الحروف (30%)
  pronunciation: number;      // النطق (30%)
  harakat: number;           // الحركات (25%)
  fluency: number;           // الطلاقة (15%)
}

function calculateNooraniScore(evaluation: NooraniEvaluation): number {
  return (
    (evaluation.letterRecognition * 0.3) +
    (evaluation.pronunciation * 0.3) +
    (evaluation.harakat * 0.25) +
    (evaluation.fluency * 0.15)
  );
}
```

### 7.2 دفتر الدرجات | Gradebook System

#### Materialized View للأداء الإجمالي:

```sql
CREATE MATERIALIZED VIEW student_overall_performance AS
SELECT
  s.id as student_id,
  s.first_name,
  s.last_name,

  -- إحصائيات التسميع
  COUNT(DISTINCT t.id) as total_tasmee3_count,
  AVG(t.final_score) as avg_tasmee3_score,

  -- إحصائيات الاختبارات
  COUNT(DISTINCT er.id) as total_exam_count,
  AVG(er.total_score) as avg_exam_score,

  -- التقدم في الحفظ
  SUM(CASE WHEN qp.status = 'MASTERED' THEN 1 ELSE 0 END) as mastered_portions,
  SUM(CASE WHEN qp.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress_portions,

  -- الحضور
  (SELECT COUNT(*) FROM attendance a
   WHERE a.student_id = s.id AND a.status = 'PRESENT') * 100.0 /
  NULLIF((SELECT COUNT(*) FROM attendance a WHERE a.student_id = s.id), 0)
  as attendance_percentage,

  -- الأداء العام
  (AVG(t.final_score) * 0.4 +
   AVG(er.total_score) * 0.4 +
   ((SELECT COUNT(*) FROM attendance a WHERE a.student_id = s.id AND a.status = 'PRESENT') * 100.0 /
    NULLIF((SELECT COUNT(*) FROM attendance a WHERE a.student_id = s.id), 0)) * 0.2
  ) as overall_performance_score

FROM students s
LEFT JOIN tasmee3 t ON t.student_id = s.id
LEFT JOIN exam_results er ON er.student_id = s.id
LEFT JOIN quran_progress qp ON qp.student_id = s.id
GROUP BY s.id, s.first_name, s.last_name;

-- Refresh the view daily
CREATE INDEX idx_student_performance ON student_overall_performance(student_id);
```

### 7.3 سياسات التقييم القابلة للتخصيص | Configurable Grading Policies

```typescript
interface GradingPolicy {
  tenantId: string;

  // أوزان التقييم
  weights: {
    quran: {
      tajweed: number;        // default: 40%
      memorization: number;   // default: 40%
      fluency: number;        // default: 20%
    };
    mutoon: {
      accuracy: number;       // default: 40%
      understanding: number;  // default: 30%
      tajweed: number;       // default: 20%
      presentation: number;  // default: 10%
    };
  };

  // سلم الدرجات
  gradingScale: {
    excellent: { min: number; max: number };  // default: 95-100
    veryGood: { min: number; max: number };   // default: 85-94
    good: { min: number; max: number };       // default: 75-84
    pass: { min: number; max: number };       // default: 60-74
    weak: { min: number; max: number };       // default: 50-59
    fail: { min: number; max: number };       // default: 0-49
  };

  // سياسة خصم النقاط
  deductionPolicy: {
    tajweedErrorDeduction: number;      // default: 2 points
    memorizationErrorDeduction: number; // default: 3 points
    maxDeduction: number;              // default: 50%
  };

  // الحد الأدنى للنجاح
  passingScore: number;  // default: 60%

  // هل يتم احتساب الحضور في الدرجة النهائية؟
  includeAttendanceInGrade: boolean;  // default: true
  attendanceWeight: number;           // default: 20%
}
```

---

## 8. نظام الشهادات | Certificate System

### 8.1 أنواع الشهادات | Certificate Types

```typescript
enum CertificateType {
  COMPLETION_JUZ = "إتمام حفظ جزء",           // Completing a Juz
  COMPLETION_MULTIPLE_JUZ = "إتمام عدة أجزاء", // Multiple Juz
  COMPLETION_QURAN = "إتمام حفظ القرآن الكامل", // Full Quran
  IJAZAH = "إجازة في القرآن الكريم",          // Ijazah (Authorization)
  MUTOON_COMPLETION = "إتمام متن",           // Completing a Matn
  NOORANI_COMPLETION = "إتمام النورانية",     // Noorani Qaida
  EXCELLENCE = "شهادة تميز",                  // Excellence Certificate
  ATTENDANCE = "شهادة حضور",                  // Attendance Certificate
  PARTICIPATION = "شهادة مشاركة"             // Participation Certificate
}
```

### 8.2 تصميم القالب | Template Design

#### قالب شهادة حفظ القرآن الكامل:

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║            بسم الله الرحمن الرحيم                           ║
║                                                               ║
║  ┌───────────────────────────────────────────────────────┐   ║
║  │         🕌                                             │   ║
║  │    [شعار الجهة]                                       │   ║
║  │                                                        │   ║
║  │         جمعية البر لتحفيظ القرآن الكريم               │   ║
║  │         Al-Birr Society for Quran Memorization        │   ║
║  └───────────────────────────────────────────────────────┘   ║
║                                                               ║
║                    ━━━━━━━━━━━━━━━━━━                      ║
║                      شهادة إتمام حفظ                        ║
║                   القرآن الكريم كاملاً                      ║
║                    ━━━━━━━━━━━━━━━━━━                      ║
║                                                               ║
║                                                               ║
║              تشهد جمعية البر لتحفيظ القرآن الكريم            ║
║                           بأن الطالب                         ║
║                                                               ║
║                    ╔══════════════════╗                       ║
║                    ║  محمد أحمد علي  ║                       ║
║                    ╚══════════════════╝                       ║
║                                                               ║
║             قد أتم حفظ كتاب الله الكريم كاملاً               ║
║                    ( 30 جزءاً )                              ║
║                   وأتقن أحكام التجويد                        ║
║                                                               ║
║                                                               ║
║    الدرجة النهائية: 96%    |    التقدير: ممتاز              ║
║    التجويد: ⭐⭐⭐⭐⭐    |    الحفظ: ⭐⭐⭐⭐⭐          ║
║    الطلاقة: ⭐⭐⭐⭐     |    الحضور: 98%                  ║
║                                                               ║
║                                                               ║
║  ┌──────────────────┐              ┌──────────────────┐      ║
║  │ توقيع المدير:    │              │ توقيع المعلم:    │      ║
║  │                  │              │                  │      ║
║  │ أحمد المدير      │              │ الشيخ خالد       │      ║
║  └──────────────────┘              └──────────────────┘      ║
║                                                               ║
║                 التاريخ: 15 رجب 1446هـ                       ║
║                        21 يناير 2025م                        ║
║                                                               ║
║                    رقم الشهادة: CRT-2025-001234             ║
║                                                               ║
║                         [QR Code]                             ║
║                  للتحقق من صحة الشهادة                       ║
║              https://verify.albirr.com/CRT-2025-001234       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### 8.3 البيانات الديناميكية | Dynamic Data Injection

```typescript
interface CertificateData {
  // بيانات الجهة
  organization: {
    nameAr: string;
    nameEn: string;
    logo: string;
    stamp: string;
  };

  // بيانات الطالب
  student: {
    fullNameAr: string;
    fullNameEn: string;
    nationalId?: string;
  };

  // بيانات الشهادة
  certificate: {
    type: CertificateType;
    certificateNumber: string;
    issueDate: Date;
    hijriDate: string;
  };

  // بيانات الإنجاز
  achievement: {
    description: string;
    portions?: string;  // e.g., "30 جزءاً" or "سورة البقرة"
    totalJuz?: number;
    grade?: number;
    gradeLevel?: string;  // ممتاز، جيد جداً، إلخ
  };

  // تفاصيل الأداء
  performance?: {
    tajweedScore: number;
    memorizationScore: number;
    fluencyScore: number;
    attendancePercentage: number;
  };

  // التوقيعات
  signatures: {
    director: {
      name: string;
      title: string;
      signature?: string;  // Base64 image
    };
    teacher: {
      name: string;
      title: string;
      signature?: string;
    };
  };

  // رمز التحقق
  verification: {
    qrCode: string;  // Base64 QR code image
    verificationUrl: string;
  };
}
```

### 8.4 توليد الشهادة | Certificate Generation

```typescript
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fontkit from '@pdf-lib/fontkit';

class CertificateGenerator {
  async generateCertificate(data: CertificateData): Promise<Buffer> {
    // 1. إنشاء مستند PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // 2. تحميل الخط العربي
    const arabicFontBytes = await fetch('fonts/Amiri-Regular.ttf')
      .then(res => res.arrayBuffer());
    const arabicFont = await pdfDoc.embedFont(arabicFontBytes);

    // 3. إضافة صفحة A4
    const page = pdfDoc.addPage([595, 842]); // A4 size

    // 4. رسم الحدود والزخارف
    this.drawBorders(page);

    // 5. إضافة الشعار
    if (data.organization.logo) {
      const logoBytes = await fetch(data.organization.logo)
        .then(res => res.arrayBuffer());
      const logo = await pdfDoc.embedPng(logoBytes);
      page.drawImage(logo, {
        x: 247.5,
        y: 750,
        width: 100,
        height: 100,
      });
    }

    // 6. كتابة النصوص
    this.drawText(page, arabicFont, data);

    // 7. إضافة QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(data.verification.verificationUrl);
    const qrCodeBytes = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    const qrCode = await pdfDoc.embedPng(qrCodeBytes);
    page.drawImage(qrCode, {
      x: 247.5,
      y: 50,
      width: 100,
      height: 100,
    });

    // 8. إضافة التوقيعات
    if (data.signatures.director.signature) {
      // رسم توقيع المدير
    }

    // 9. توليد PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  private drawBorders(page: any) {
    // رسم حدود مزخرفة
    page.drawRectangle({
      x: 30,
      y: 30,
      width: 535,
      height: 782,
      borderColor: rgb(0.7, 0.5, 0.2),
      borderWidth: 3,
    });

    page.drawRectangle({
      x: 40,
      y: 40,
      width: 515,
      height: 762,
      borderColor: rgb(0.7, 0.5, 0.2),
      borderWidth: 1,
    });
  }

  private drawText(page: any, font: any, data: CertificateData) {
    const { width, height } = page.getSize();

    // البسملة
    page.drawText('بسم الله الرحمن الرحيم', {
      x: width / 2 - 100,
      y: height - 100,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    // اسم الجهة
    page.drawText(data.organization.nameAr, {
      x: width / 2 - 150,
      y: height - 200,
      size: 18,
      font: font,
    });

    // عنوان الشهادة
    page.drawText('شهادة إتمام حفظ القرآن الكريم كاملاً', {
      x: width / 2 - 140,
      y: height - 280,
      size: 22,
      font: font,
      color: rgb(0.7, 0.5, 0.2),
    });

    // نص الشهادة
    page.drawText('تشهد جمعية البر لتحفيظ القرآن الكريم', {
      x: width / 2 - 120,
      y: height - 340,
      size: 14,
      font: font,
    });

    page.drawText('بأن الطالب', {
      x: width / 2 - 40,
      y: height - 370,
      size: 14,
      font: font,
    });

    // اسم الطالب (بخط كبير)
    page.drawText(data.student.fullNameAr, {
      x: width / 2 - 80,
      y: height - 410,
      size: 24,
      font: font,
      color: rgb(0, 0.3, 0.6),
    });

    // باقي النصوص...
  }
}
```

### 8.5 التحقق من الشهادة | Certificate Verification

```typescript
// API endpoint للتحقق
app.get('/api/v1/certificates/verify/:certificateNumber', async (req, res) => {
  const { certificateNumber } = req.params;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber },
    include: {
      student: {
        include: {
          profile: true,
        },
      },
      organization: true,
      issuedBy: true,
    },
  });

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'الشهادة غير موجودة',
      messageEn: 'Certificate not found',
    });
  }

  // عرض صفحة التحقق
  res.json({
    success: true,
    certificate: {
      number: certificate.certificateNumber,
      type: certificate.type,
      studentName: `${certificate.student.profile.firstName} ${certificate.student.profile.lastName}`,
      organizationName: certificate.organization.nameAr,
      issueDate: certificate.issuedAt,
      isValid: certificate.isValid,
      grade: certificate.metadata?.grade,
    },
  });
});
```

---

## 9. خريطة الطريق | Implementation Roadmap

### المرحلة الأولى - MVP (شهرين) | Phase 1 - MVP (2 Months)

#### Sprint 1-2: البنية التحتية الأساسية (أسبوعان)
- ✅ إعداد البيئة والمشروع
- ✅ إعداد قاعدة البيانات والمخطط
- ✅ نظام المصادقة والترخيص
- ✅ Multi-Tenancy الأساسي
- ✅ Admin Panel للمنصة

#### Sprint 3-4: إدارة المستخدمين والجهات (أسبوعان)
- 🔲 تسجيل الجهات الجديدة
- 🔲 إدارة المستخدمين (CRUD)
- 🔲 إدارة الأدوار والصلاحيات
- 🔲 لوحة تحكم الجهة
- 🔲 إعدادات الجهة

#### Sprint 5-6: إدارة الطلاب والحلقات (أسبوعان)
- 🔲 تسجيل الطلاب
- 🔲 إنشاء الحلقات
- 🔲 تعيين الطلاب للحلقات
- 🔲 تعيين المعلمين للحلقات
- 🔲 جدولة الحلقات

#### Sprint 7-8: نظام التسميع الأساسي (أسبوعان)
- 🔲 واجهة التسميع للمعلم
- 🔲 تسجيل التقييمات
- 🔲 تتبع تقدم الطلاب
- 🔲 عرض سجل التسميع
- 🔲 إشعارات أولياء الأمور

**المخرجات (Deliverables):**
- ✅ نظام عامل للمصادقة
- ✅ إدارة Multi-Tenant كاملة
- ✅ CRUD للجهات والمستخدمين والطلاب
- ✅ نظام تسميع بسيط
- ✅ إشعارات أساسية

---

### المرحلة الثانية - المميزات الأساسية (3 أشهر) | Phase 2 - Core Features (3 Months)

#### Sprint 9-10: نظام الحضور (أسبوعان)
- 🔲 تسجيل الحضور اليومي
- 🔲 تقارير الحضور
- 🔲 تنبيهات الغياب
- 🔲 إحصائيات الحضور

#### Sprint 11-12: نظام الاختبارات (أسبوعان)
- 🔲 إنشاء الاختبارات
- 🔲 جدولة الاختبارات
- 🔲 تسجيل النتائج
- 🔲 تقارير النتائج

#### Sprint 13-14: نظام التقارير (أسبوعان)
- 🔲 تقارير الطلاب الفردية
- 🔲 تقارير الحلقات
- 🔲 تقارير المعلمين
- 🔲 تقارير الجهة الشاملة
- 🔲 تصدير PDF/Excel

#### Sprint 15-16: نظام الرسائل (أسبوعان)
- 🔲 الرسائل الداخلية
- 🔲 الإشعارات المتقدمة
- 🔲 تكامل البريد الإلكتروني
- 🔲 تكامل WhatsApp

#### Sprint 17-18: نظام الشهادات الأساسي (أسبوعان)
- 🔲 قوالب الشهادات
- 🔲 توليد الشهادات
- 🔲 QR Code للتحقق
- 🔲 صفحة التحقق العامة

#### Sprint 19-20: تطبيق الجوال (أسبوعان)
- 🔲 تطبيق React Native
- 🔲 واجهات المعلم
- 🔲 واجهات ولي الأمر
- 🔲 الإشعارات Push

**المخرجات:**
- ✅ نظام حضور كامل
- ✅ نظام اختبارات متكامل
- ✅ تقارير شاملة
- ✅ نظام رسائل وإشعارات
- ✅ شهادات قابلة للتحقق
- ✅ تطبيق جوال

---

### المرحلة الثالثة - المميزات المتقدمة (3 أشهر) | Phase 3 - Advanced Features (3 Months)

#### Sprint 21-22: نظام المدفوعات والاشتراكات (أسبوعان)
- 🔲 إدارة خطط الاشتراك
- 🔲 تكامل بوابات الدفع (Stripe, PayPal, Hyperpay)
- 🔲 الفواتير التلقائية
- 🔲 تتبع الإيرادات

#### Sprint 23-24: Analytics المتقدمة (أسبوعان)
- 🔲 لوحات معلومات تفاعلية
- 🔲 تحليلات الأداء
- 🔲 تنبؤات AI
- 🔲 Insights ذكية

#### Sprint 25-26: المتون والنورانية (أسبوعان)
- 🔲 إدارة المتون
- 🔲 تقييم المتون
- 🔲 منهج النورانية
- 🔲 تتبع التقدم

#### Sprint 27-28: الفصول الافتراضية (أسبوعان)
- 🔲 تكامل Zoom/Jitsi
- 🔲 جدولة الحلقات الافتراضية
- 🔲 تسجيل الحضور التلقائي
- 🔲 مكتبة التسجيلات

#### Sprint 29-30: المكتبة الإسلامية (أسبوعان)
- 🔲 مكتبة الكتب الرقمية
- 🔲 مكتبة الفيديو
- 🔲 مكتبة الصوتيات
- 🔲 نظام البحث

#### Sprint 31-32: التحسينات والأمان (أسبوعان)
- 🔲 تحسين الأداء
- 🔲 تدقيق الأمان
- 🔲 اختبارات الحمل
- 🔲 تحسين التجربة

**المخرجات:**
- ✅ نظام مدفوعات متكامل
- ✅ تحليلات متقدمة مع AI
- ✅ دعم المتون والنورانية
- ✅ فصول افتراضية
- ✅ مكتبة إسلامية شاملة
- ✅ نظام آمن ومُحسّن

---

## 10. التحسينات المستقبلية بالذكاء الاصطناعي | AI-Powered Future Enhancements

### 10.1 كشف أخطاء التجويد تلقائياً | Automated Tajweed Error Detection

```typescript
interface TajweedAIService {
  /**
   * تحليل تسجيل صوتي للتسميع والكشف عن أخطاء التجويد
   * Analyze audio recording and detect Tajweed errors
   */
  analyzeTajweed(audioFile: Buffer): Promise<TajweedAnalysisResult>;
}

interface TajweedAnalysisResult {
  // النص المتوقع
  recognizedText: string;

  // مطابقة النص مع المقرر
  textAccuracy: number;

  // الأخطاء المكتشفة
  detectedErrors: Array<{
    type: TajweedErrorType;
    timestamp: number;        // وقت الخطأ في التسجيل (بالثواني)
    word: string;            // الكلمة التي حدث فيها الخطأ
    expectedPronunciation: string;
    actualPronunciation: string;
    severity: 'minor' | 'major' | 'critical';
    suggestion: string;      // اقتراح للتصحيح
  }>;

  // تقييم الأداء
  performance: {
    tajweedScore: number;
    pronunciationScore: number;
    fluencyScore: number;
    paceScore: number;
  };

  // توصيات
  recommendations: string[];
}
```

**التقنيات المقترحة:**
- **ASR (Automatic Speech Recognition)**: Google Cloud Speech-to-Text مع تخصيص للغة العربية القرآنية
- **NLP**: تحليل النص ومقارنته بالنص القرآني الصحيح
- **Deep Learning**: نموذج مدرب على أحكام التجويد
- **Phoneme Analysis**: تحليل الأصوات والحروف بدقة

### 10.2 توقع تقدم الطالب | Student Progress Prediction

```typescript
interface ProgressPredictionService {
  /**
   * توقع مدة حفظ الطالب للقرآن الكامل
   * Predict time to complete full Quran memorization
   */
  predictCompletionTime(studentId: string): Promise<PredictionResult>;

  /**
   * تحديد الطلاب المعرضين لخطر التأخر
   * Identify at-risk students
   */
  identifyAtRiskStudents(classId: string): Promise<StudentRisk[]>;
}

interface PredictionResult {
  studentId: string;
  currentProgress: {
    completedJuz: number;
    completionPercentage: number;
    avgDailyProgress: number;
  };

  prediction: {
    estimatedCompletionDate: Date;
    confidenceLevel: number;

    bestCaseScenario: {
      date: Date;
      requiredDailyPages: number;
    };

    worstCaseScenario: {
      date: Date;
      likelihood: number;
    };
  };

  factors: {
    attendanceRate: number;
    avgTasmee3Score: number;
    consistency: number;
    learningPace: 'fast' | 'medium' | 'slow';
  };

  recommendations: string[];
}

interface StudentRisk {
  studentId: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  interventions: string[];
}
```

**خوارزميات ML المقترحة:**
- **Linear Regression**: للتنبؤ بالوقت المتبقي
- **Random Forest**: لتحديد الطلاب المعرضين للخطر
- **Time Series Analysis**: لتحليل الأنماط الزمنية
- **Clustering**: لتجميع الطلاب حسب أنماط التعلم

### 10.3 توصيات شخصية | Personalized Recommendations

```typescript
interface RecommendationEngine {
  /**
   * توليد توصيات مخصصة لكل طالب
   * Generate personalized recommendations for each student
   */
  getRecommendations(studentId: string): Promise<Recommendations>;
}

interface Recommendations {
  studentId: string;

  // توصيات المقرر
  curriculumRecommendations: Array<{
    type: 'increase_pace' | 'decrease_pace' | 'focus_on_review';
    reason: string;
    suggestedDailyPages: number;
    suggestedReviewSchedule: string;
  }>;

  // توصيات التحسين
  improvementAreas: Array<{
    area: 'tajweed' | 'memorization' | 'fluency';
    currentScore: number;
    targetScore: number;
    exercises: Array<{
      title: string;
      description: string;
      estimatedDuration: number;
    }>;
  }>;

  // توصيات الجدولة
  scheduleRecommendations: {
    optimalStudyTime: string;
    optimalSessionDuration: number;
    recommendedBreakFrequency: number;
  };

  // محتوى موصى به
  recommendedContent: Array<{
    type: 'video' | 'audio' | 'article';
    title: string;
    url: string;
    relevance: number;
  }>;
}
```

### 10.4 مساعد ذكي (Chatbot) | AI Assistant

```typescript
interface AIAssistant {
  /**
   * الإجابة على استفسارات الطلاب والمعلمين
   * Answer queries from students and teachers
   */
  chat(userId: string, message: string): Promise<ChatResponse>;
}

interface ChatResponse {
  message: string;

  // إجراءات مقترحة
  suggestedActions?: Array<{
    label: string;
    action: string;
    params: any;
  }>;

  // مراجع
  references?: Array<{
    title: string;
    url: string;
  }>;

  // هل يحتاج تدخل بشري؟
  requiresHumanIntervention: boolean;
}
```

**Use Cases:**
- الإجابة على أسئلة حول أحكام التجويد
- مساعدة الطلاب في تنظيم وقتهم
- شرح الأخطاء الشائعة وكيفية تجنبها
- تقديم نصائح للحفظ والمراجعة
- الإجابة على استفسارات أولياء الأمور

### 10.5 تحليل المشاعر | Sentiment Analysis

```typescript
interface SentimentAnalysisService {
  /**
   * تحليل مشاعر الطلاب من رسائلهم وتفاعلاتهم
   * Analyze student sentiment from messages and interactions
   */
  analyzeSentiment(studentId: string, period: DateRange): Promise<SentimentReport>;
}

interface SentimentReport {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1

  trends: Array<{
    date: Date;
    sentiment: number;
  }>;

  factors: {
    academicPerformance: number;
    teacherInteraction: number;
    peerInteraction: number;
    parentEngagement: number;
  };

  alerts: Array<{
    type: 'motivation_drop' | 'stress' | 'disengagement';
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestedAction: string;
  }>;
}
```

**المصادر:**
- رسائل الطالب
- ملاحظات المعلم
- تعليقات التقييمات
- نمط الحضور والتفاعل

### 10.6 تحليل الصوت المتقدم | Advanced Voice Analysis

```typescript
interface VoiceAnalysisService {
  /**
   * تحليل جودة التلاوة من حيث:
   * - الإخراج الصحيح للحروف (Makharij)
   * - الصفات (Sifaat)
   * - الوقف والابتداء
   */
  analyzeRecitation(audioFile: Buffer, verseRange: string): Promise<RecitationAnalysis>;
}

interface RecitationAnalysis {
  // تحليل المخارج
  makhaarijAnalysis: Array<{
    letter: string;
    position: number;
    correctness: number;
    feedback: string;
  }>;

  // تحليل الصفات
  sifaatAnalysis: Array<{
    property: string;
    score: number;
    examples: Array<{
      word: string;
      timestamp: number;
      assessment: string;
    }>;
  }>;

  // تحليل الوقف والابتداء
  waqfAnalysis: {
    correctStops: number;
    incorrectStops: number;
    missedStops: number;
    recommendations: string[];
  };

  // التقييم الإجمالي
  overallAssessment: {
    technicalScore: number;
    artisticScore: number;
    suggestions: string[];
  };
}
```

---

## 11. الأمان والخصوصية | Security & Privacy

### 11.1 تدابير الأمان | Security Measures

```typescript
// 1. تشفير البيانات الحساسة
class EncryptionService {
  private static algorithm = 'aes-256-gcm';
  private static key = process.env.ENCRYPTION_KEY!;

  static encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  static decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// 2. Row-Level Security في PostgreSQL
-- تفعيل RLS على جميع الجداول الحساسة
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasmee3 ENABLE ROW LEVEL SECURITY;
-- ... إلخ

-- سياسة الوصول بناءً على tenant_id
CREATE POLICY tenant_isolation_policy ON students
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_policy ON teachers
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- في كود التطبيق، تعيين tenant_id قبل كل استعلام
await prisma.$executeRaw`SET app.current_tenant_id = ${tenantId}`;

// 3. Audit Logging لجميع العمليات الحساسة
class AuditLogger {
  static async log(action: string, userId: string, details: any) {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: JSON.stringify(details),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date(),
      },
    });
  }
}

// استخدام Middleware للتسجيل التلقائي
app.use(async (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    await AuditLogger.log(
      `${req.method} ${req.path}`,
      req.user?.id,
      {
        body: req.body,
        params: req.params,
        query: req.query,
      }
    );
  }
  next();
});
```

### 11.2 الخصوصية وGDPR | Privacy & GDPR Compliance

```typescript
// 1. حذف البيانات الشخصية (Right to be Forgotten)
class DataPrivacyService {
  async deleteUserData(userId: string, reason: string) {
    await prisma.$transaction(async (tx) => {
      // 1. Anonymize user data
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${userId}@deleted.com`,
          phone: null,
          profile: {
            update: {
              firstName: 'Deleted',
              lastName: 'User',
              nationalId: null,
              photo: null,
            },
          },
        },
      });

      // 2. Delete sensitive data
      await tx.userSession.deleteMany({ where: { userId } });
      await tx.notification.deleteMany({ where: { userId } });

      // 3. Keep audit trail
      await tx.dataDeletionLog.create({
        data: {
          userId,
          reason,
          deletedAt: new Date(),
          deletedBy: req.user.id,
        },
      });
    });
  }

  // 2. تصدير البيانات (Data Portability)
  async exportUserData(userId: string): Promise<Buffer> {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        student: {
          include: {
            tasmee3: true,
            examResults: true,
            quranProgress: true,
            attendance: true,
          },
        },
        teacher: {
          include: {
            classes: true,
          },
        },
      },
    });

    // تحويل إلى JSON
    const jsonData = JSON.stringify(userData, null, 2);

    // إنشاء ملف ZIP
    const zip = new JSZip();
    zip.file('user_data.json', jsonData);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    return zipBuffer;
  }
}

// 3. Consent Management
interface ConsentRecord {
  userId: string;
  consentType: 'data_collection' | 'marketing' | 'analytics' | 'third_party_sharing';
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  version: string; // نسخة سياسة الخصوصية
}

// Middleware للتحقق من الموافقة
function requireConsent(consentType: string) {
  return async (req, res, next) => {
    const consent = await prisma.consent.findFirst({
      where: {
        userId: req.user.id,
        consentType,
        granted: true,
        revokedAt: null,
      },
    });

    if (!consent) {
      return res.status(403).json({
        success: false,
        message: 'يتطلب هذا الإجراء موافقتك',
        messageEn: 'This action requires your consent',
        consentType,
      });
    }

    next();
  };
}
```

---

## 12. النشر والبنية التحتية | Deployment & Infrastructure

### 12.1 Docker Configuration

```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build
RUN npx prisma generate

# Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./uploads:/app/uploads
      - ./certificates:/app/certificates

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: ${API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  redis_data:
```

### 12.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker images
        run: |
          docker build -t quran-school-backend:latest ./backend
          docker build -t quran-school-frontend:latest ./frontend

      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push quran-school-backend:latest
          docker push quran-school-frontend:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/quran-school
            docker-compose pull
            docker-compose up -d
            docker-compose exec backend npx prisma migrate deploy
```

---

## 13. الخلاصة والتوصيات | Conclusion & Recommendations

### 13.1 ملخص النظام | System Summary

تم تصميم **نظام إدارة مدارس تحفيظ القرآن الكريم** ليكون:

✅ **Multi-Tenant SaaS Platform** قابل للتوسع
✅ **شامل** يغطي جميع جوانب إدارة المدرسة
✅ **سهل الاستخدام** مع واجهات بديهية بالعربية والإنجليزية
✅ **آمن** مع تشفير البيانات وRLS
✅ **قابل للتخصيص** لكل جهة حسب احتياجاتها
✅ **مدعوم بالذكاء الاصطناعي** للتحسين المستمر
✅ **متوافق مع الأجهزة المحمولة** عبر تطبيقات أصلية

### 13.2 أولويات التنفيذ | Implementation Priorities

**🔴 عالية الأولوية (MVP):**
1. نظام المصادقة والترخيص
2. Multi-Tenancy
3. إدارة المستخدمين والطلاب
4. نظام التسميع الأساسي
5. تتبع التقدم

**🟡 متوسطة الأولوية (Phase 2):**
1. نظام الحضور
2. نظام الاختبارات
3. التقارير الشاملة
4. الرسائل والإشعارات
5. الشهادات

**🟢 منخفضة الأولوية (Phase 3):**
1. نظام المدفوعات
2. AI Analytics
3. الفصول الافتراضية
4. المكتبة الإسلامية
5. المتون والنورانية المتقدمة

### 13.3 التوصيات النهائية | Final Recommendations

1. **ابدأ بـ MVP** وأطلق بسرعة لجمع feedback من المستخدمين الحقيقيين
2. **استخدم Agile Methodology** مع sprints أسبوعية
3. **اختبر مع جهة واحدة أولاً** (Beta testing) قبل الإطلاق العام
4. **استثمر في UX/UI** - التجربة الممتازة تعني نجاح المنتج
5. **وثّق كل شيء** - للمطورين الجدد وللمستخدمين
6. **أمّن البيانات** - خصوصية الطلاب أولوية قصوى
7. **قم بعمل Backups يومية** مع disaster recovery plan
8. **راقب الأداء باستمرار** واستخدم monitoring tools
9. **جهّز فريق دعم فني** متاح بالعربية
10. **خطط للتوسع المستقبلي** - البنية يجب أن تتحمل آلاف الجهات

---

## 14. الملاحق | Appendices

### الملحق أ: قاموس المصطلحات | Glossary

| المصطلح العربي | المصطلح الإنجليزي | الشرح |
|----------------|-------------------|-------|
| تسميع | Tasmee3 | Recitation evaluation session |
| حلقة | Halaqah | Study circle/class |
| إجازة | Ijazah | Authorization to teach |
| التجويد | Tajweed | Quranic recitation rules |
| مُتون | Mutoon | Islamic texts for memorization |
| نورانية | Noorani Qaida | Arabic reading primer |
| مراجعة | Muraja'ah | Review/Revision |
| حفظ جديد | Hifz Jadeed | New memorization |
| إتقان | Itqan | Mastery |

### الملحق ب: المراجع | References

1. **Technical Documentation:**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [NestJS Documentation](https://docs.nestjs.com)
   - [Prisma Documentation](https://www.prisma.io/docs)
   - [PostgreSQL Multi-Tenancy](https://www.citusdata.com/blog/2016/10/03/designing-your-saas-database-for-high-scalability/)

2. **Islamic Resources:**
   - [Quran.com API](https://quran.api-docs.io/)
   - [Tajweed Rules Guide](https://www.tajweed.me/)
   - أحكام التجويد - الشيخ أيمن سويد

3. **Design Resources:**
   - [Islamic Design Patterns](https://www.islamic-patterns.com/)
   - [Arabic Typography Best Practices](https://arabictypography.com/)

### الملحق ج: نماذج الاختبار | Test Cases

```typescript
describe('Tasmee3 Service', () => {
  it('should create tasmee3 record with valid data', async () => {
    const tasmee3Data = {
      studentId: 'student-1',
      teacherId: 'teacher-1',
      classId: 'class-1',
      type: 'HIFZ_NEW',
      fromVerse: 'البقرة:1',
      toVerse: 'البقرة:10',
      tajweedScore: 95,
      memorizationScore: 90,
      fluencyScore: 92,
    };

    const result = await tasmee3Service.create(tasmee3Data);

    expect(result.finalScore).toBeCloseTo(92.2, 1);
    expect(result.grade).toBe('EXCELLENT');
  });

  it('should deduct points for tajweed errors', async () => {
    const evaluation = {
      tajweedScore: 100,
      memorizationScore: 100,
      fluencyScore: 100,
      errors: [
        { type: 'GHUNNAH', word: 'من' },
        { type: 'MADD_TABEE3I', word: 'الله' },
      ],
    };

    const score = calculateQuranScore(evaluation);

    // Should deduct 2 points per error from tajweed (40% weight)
    // 100 - 4 = 96 for tajweed
    // Final: (96*0.4) + (100*0.4) + (100*0.2) = 98.4
    expect(score).toBeCloseTo(98.4, 1);
  });
});
```

---

**🕌 بارك الله فيكم | May Allah Bless You**

**تم بحمد الله**
**Completed by the Grace of Allah**

---

**رقم المستند:** SPEC-QMS-2025-v2.0
**تاريخ الإصدار:** 21 فبراير 2026
**المؤلف:** فريق التطوير الكامل (Product Manager + Tech Lead + Engineers + Designers + QA + DevOps + Islamic Education Expert)

