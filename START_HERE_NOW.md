# 🚀 ابدأ هنا - نظام إدارة مدارس تحفيظ القرآن الكريم

## ✅ تم! النظام جاهز للاستخدام

تم إنشاء نظام كامل بجميع البيانات. الآن يمكنك تجربة النظام مباشرة!

---

## 📋 ما تم إنشاؤه لك:

### 1️⃣ الجمعية الخيرية
- **الاسم**: جمعية البر الخيرية لتحفيظ القرآن الكريم
- **المدارس**: 1 مدرسة
- **الحلقات**: 1 حلقة (حلقة الحفظ المتقدم)

### 2️⃣ المستخدمون (5 حسابات جاهزة)

| الدور | الإيميل | كلمة المرور | الوصف |
|------|---------|-------------|-------|
| **👑 المسؤول الرئيسي** | admin@albirr.com | 123456 | صلاحيات كاملة |
| **👤 مدير الجمعية** | manager@albirr.com | 123456 | إدارة الجمعية |
| **👨‍🏫 المعلم** | ahmed@albirr.com | 123456 | المعلم أحمد الحافظ |
| **👨‍👦 ولي الأمر** | guardian1@test.com | 123456 | محمد أحمد |
| **👨‍🎓 الطالب** | student1@test.com | 123456 | عبدالرحمن محمد |

---

## 🎯 كيف تجرب النظام الآن؟

### الطريقة 1: تسجيل الدخول عبر API

#### باستخدام Thunder Client (الأسهل):

1. **ثبّت Thunder Client**:
   - افتح VS Code
   - Extensions (Ctrl+Shift+X)
   - ابحث عن "Thunder Client"
   - Install

2. **سجّل الدخول**:
   - افتح Thunder Client
   - New Request
   - POST
   - URL: `http://localhost:5000/api/v1/auth/login`
   - Body → JSON:
   ```json
   {
     "email": "admin@albirr.com",
     "password": "123456"
   }
   ```
   - Send

3. **ستحصل على**:
   ```json
   {
     "success": true,
     "message": "تم تسجيل الدخول بنجاح",
     "data": {
       "user": {
         "id": "...",
         "email": "admin@albirr.com",
         "role": "SUPER_ADMIN",
         "profile": { ... }
       },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```

4. **استخدم الـ Token**:
   - انسخ الـ token
   - في أي request جديد، اذهب إلى Headers
   - أضف:
     - Key: `Authorization`
     - Value: `Bearer YOUR_TOKEN_HERE`

---

#### باستخدام PowerShell:

```powershell
# تسجيل الدخول
$body = @{
    email = "admin@albirr.com"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body

# عرض النتيجة
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

### الطريقة 2: استكشاف قاعدة البيانات بصرياً

افتح **PowerShell أو CMD جديد** واكتب:

```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
npx prisma studio
```

سيفتح متصفح على `http://localhost:5555` حيث يمكنك:
- ✅ رؤية جميع البيانات
- ✅ تعديل البيانات
- ✅ إضافة بيانات جديدة
- ✅ استكشاف العلاقات بين الجداول

**الجداول المهمة:**
- **User** - جميع المستخدمين (5 مستخدمين)
- **Profile** - الملفات الشخصية
- **Organization** - الجمعية الخيرية
- **School** - المدرسة
- **Class** - الحلقات
- **Student** - الطلاب
- **Teacher** - المعلمين
- **QuranProgress** - تقدم الطالب في القرآن
- **NooraniProgress** - تقدم الطالب في النورانية

---

## 📖 جميع واجهات API المتاحة:

### 🔐 المصادقة (Authentication)

#### تسجيل الدخول
```
POST /api/v1/auth/login
Body: { "email": "admin@albirr.com", "password": "123456" }
```

#### تسجيل مستخدم جديد
```
POST /api/v1/auth/register
Body: {
  "email": "new@test.com",
  "password": "123456",
  "role": "STUDENT",
  "firstName": "أحمد",
  "lastName": "محمد",
  "gender": "MALE"
}
```

#### الحصول على بيانات المستخدم الحالي
```
GET /api/v1/auth/me
Headers: Authorization: Bearer YOUR_TOKEN
```

#### تغيير كلمة المرور
```
POST /api/v1/auth/change-password
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "currentPassword": "123456",
  "newPassword": "newpassword"
}
```

---

### 📊 واجهات التجربة (Demo Endpoints)

#### عرض الإحصائيات
```
GET /api/v1/demo/stats
```

#### عرض جميع الطلاب
```
GET /api/v1/demo/students
```

#### عرض جميع المعلمين
```
GET /api/v1/demo/teachers
```

#### إنشاء طالب تجريبي
```
POST /api/v1/demo/create-student
```

#### إنشاء معلم تجريبي
```
POST /api/v1/demo/create-teacher
```

#### حذف البيانات التجريبية
```
DELETE /api/v1/demo/reset
```

---

## 🔄 إعادة إنشاء البيانات

إذا حذفت البيانات أو تريد البدء من جديد:

```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
node create-demo-data.js
```

سيقوم السكريبت بـ:
1. ✅ حذف البيانات القديمة
2. ✅ إنشاء جمعية جديدة
3. ✅ إنشاء مدرسة
4. ✅ إنشاء 5 مستخدمين (مدير، مدير جمعية، معلم، ولي أمر، طالب)
5. ✅ إنشاء حلقة وربط المعلم بها
6. ✅ تسجيل الطالب في الحلقة
7. ✅ إنشاء تقدم القرآن والنورانية للطالب

---

## 🎨 اختبار الأدوار المختلفة

### 1. جرّب كمسؤول (Super Admin)
```json
{
  "email": "admin@albirr.com",
  "password": "123456"
}
```
**الصلاحيات**: كل شيء!

---

### 2. جرّب كمدير جمعية (Organization Admin)
```json
{
  "email": "manager@albirr.com",
  "password": "123456"
}
```
**الصلاحيات**: إدارة الجمعية، المدارس، الحلقات

---

### 3. جرّب كمعلم (Teacher)
```json
{
  "email": "ahmed@albirr.com",
  "password": "123456"
}
```
**الصلاحيات**: تقييم الطلاب، حضور وغياب، رسائل

---

### 4. جرّب كولي أمر (Guardian)
```json
{
  "email": "guardian1@test.com",
  "password": "123456"
}
```
**الصلاحيات**: متابعة ابنه، رسائل المعلم، تقارير

---

### 5. جرّب كطالب (Student)
```json
{
  "email": "student1@test.com",
  "password": "123456"
}
```
**الصلاحيات**: عرض تقدمه، تقييماته، جدوله

---

## 📱 مثال عملي كامل:

### السيناريو: المعلم يقيّم الطالب

1. **المعلم يسجل دخول**:
```bash
POST /api/v1/auth/login
Body: {"email":"ahmed@albirr.com","password":"123456"}
# احفظ الـ token
```

2. **المعلم يعرض طلابه**:
```bash
GET /api/v1/demo/students
Headers: Authorization: Bearer TOKEN
```

3. **المعلم يضيف تقييم** (ستحتاج إنشاء هذه الـ route لاحقاً):
```bash
POST /api/v1/evaluations/quran
Headers: Authorization: Bearer TOKEN
Body: {
  "studentId": "student_id_from_step_2",
  "type": "HIFZ_NEW",
  "fromSurah": "البقرة",
  "toSurah": "البقرة",
  "fromVerse": 1,
  "toVerse": 5,
  "tajweedScore": 90,
  "hifzScore": 85,
  "fluencyScore": 88
}
```

---

## 🏗️ الخطوات التالية (اختياري):

إذا تريد تطوير أكثر:

### 1. إضافة routes جديدة:
- ✅ إدارة الطلاب (CRUD)
- ✅ إدارة المعلمين (CRUD)
- ✅ إدارة الحلقات (CRUD)
- ✅ نظام التقييم الكامل
- ✅ نظام الرسائل
- ✅ نظام الإشعارات
- ✅ التقارير

### 2. بناء واجهة أمامية (Frontend):
- React + TypeScript (موجود في مجلد `/frontend`)
- صفحة تسجيل دخول
- لوحة تحكم لكل دور
- صفحات التقييم
- التقارير

### 3. إضافة مميزات:
- ✅ نظام الحضور والغياب
- ✅ الشهادات والإجازات
- ✅ الاختبارات
- ✅ التقارير المتقدمة
- ✅ WhatsApp و Email notifications

---

## 📚 الملفات المهمة:

| الملف | الوصف |
|-------|-------|
| [DOCUMENTATION_AR.md](DOCUMENTATION_AR.md) | الوثائق الكاملة (3000+ سطر) |
| [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md) | دليل التجربة السريعة |
| [TESTING_GUIDE.md](backend/TESTING_GUIDE.md) | دليل الاختبار التفصيلي |
| [README.md](README.md) | نظرة عامة |
| [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) | دليل بناء الواجهة الأمامية |

---

## ❓ أسئلة شائعة:

### س: كيف أضيف طالب جديد؟
**ج**: استخدم Prisma Studio أو API endpoint `/api/v1/auth/register`

### س: كيف أرى التقييمات؟
**ج**: افتح Prisma Studio → QuranEvaluation

### س: كيف أغير كلمة المرور؟
**ج**: استخدم `/api/v1/auth/change-password`

### س: كيف أضيف حلقة جديدة؟
**ج**: استخدم Prisma Studio → Class → Add record

### س: كيف أحذف كل البيانات وأبدأ من جديد؟
**ج**: شغّل `node create-demo-data.js` مرة أخرى

---

## 💡 نصائح مهمة:

1. ✅ **احفظ الـ Token**: بعد تسجيل الدخول، احفظ الـ token لاستخدامه في الطلبات التالية
2. ✅ **استخدم Prisma Studio**: أسهل طريقة لاستكشاف وتعديل البيانات
3. ✅ **اقرأ DOCUMENTATION_AR.md**: يحتوي على كل التفاصيل
4. ✅ **جرّب الأدوار المختلفة**: سجّل دخول بكل دور لترى الفرق
5. ✅ **شغّل المتصفح**: افتح `http://localhost:5000` لترى صفحة الترحيب

---

## 🎉 **ابدأ الآن!**

### الخطوة 1: تأكد أن الخادم يعمل
```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
npm run dev
```

### الخطوة 2: سجّل دخول
افتح Thunder Client أو PowerShell وسجّل دخول بـ `admin@albirr.com / 123456`

### الخطوة 3: استكشف!
جرّب جميع الواجهات واستكشف النظام!

---

**ملاحظة**: كلمة السر لجميع الحسابات: `123456`

**تم إنشاء النظام بنجاح! 🎊**
