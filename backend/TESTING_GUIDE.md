# 🧪 دليل تجربة النظام - Testing Guide

## طريقة تجربة النظام بسرعة

الآن يمكنك تجربة النظام من المتصفح مباشرة!

---

## 📝 الخطوات:

### 1️⃣ تأكد أن الخادم يعمل

يجب أن ترى في الـ CMD:
```
🚀 Server running on port 5000
💚 Health Check: http://localhost:5000/health
```

إذا لم يكن الخادم يعمل، افتح CMD في مجلد `backend` وشغله:
```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
npm run dev
```

---

### 2️⃣ جرب المسارات التجريبية من المتصفح

#### ✅ اختبار الاتصال:
افتح المتصفح واكتب:
```
http://localhost:5000/api/v1/demo/stats
```
ستشاهد إحصائيات النظام (عدد المستخدمين، الطلاب، المعلمين، الحلقات)

---

#### ✅ عرض جميع الطلاب:
```
http://localhost:5000/api/v1/demo/students
```
ستشاهد قائمة بجميع الطلاب الموجودين في النظام

---

#### ✅ عرض جميع المعلمين:
```
http://localhost:5000/api/v1/demo/teachers
```
ستشاهد قائمة بجميع المعلمين

---

### 3️⃣ إضافة بيانات تجريبية

لإضافة طالب أو معلم تجريبي، تحتاج استخدام أداة لإرسال POST request.

#### خيار 1: استخدام Thunder Client (موصى به)

1. **تثبيت Thunder Client:**
   - افتح VS Code
   - اذهب للامتدادات Extensions (Ctrl+Shift+X)
   - ابحث عن "Thunder Client"
   - اضغط Install

2. **إنشاء طالب تجريبي:**
   - افتح Thunder Client من الشريط الجانبي
   - اضغط "New Request"
   - اختر POST
   - ضع الرابط: `http://localhost:5000/api/v1/demo/create-student`
   - اضغط Send
   - ستحصل على بيانات الطالب الجديد مع الإيميل والباسورد

3. **إنشاء معلم تجريبي:**
   - POST: `http://localhost:5000/api/v1/demo/create-teacher`
   - اضغط Send

#### خيار 2: استخدام PowerShell

افتح PowerShell واكتب:

**لإنشاء طالب:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/v1/demo/create-student" -Method POST -ContentType "application/json"
```

**لإنشاء معلم:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/v1/demo/create-teacher" -Method POST -ContentType "application/json"
```

---

### 4️⃣ استكشاف قاعدة البيانات بصرياً

استخدم Prisma Studio لرؤية البيانات بشكل مرئي:

1. افتح CMD جديد في مجلد backend
2. اكتب:
```bash
cd c:\Users\Mazen\Desktop\yuoser\backend
npx prisma studio
```

3. سيفتح متصفح على `http://localhost:5555`
4. ستشاهد جميع الجداول ويمكنك:
   - استعراض البيانات
   - إضافة بيانات جديدة
   - تعديل البيانات
   - حذف البيانات

---

### 5️⃣ حذف البيانات التجريبية

عندما تريد البدء من جديد:

**من Thunder Client:**
- DELETE: `http://localhost:5000/api/v1/demo/reset`

**من PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/v1/demo/reset" -Method DELETE
```

---

## 📋 جميع المسارات المتاحة:

| الطريقة | الرابط | الوصف |
|---------|--------|-------|
| GET | `/api/v1/demo/stats` | إحصائيات النظام |
| GET | `/api/v1/demo/students` | عرض جميع الطلاب |
| GET | `/api/v1/demo/teachers` | عرض جميع المعلمين |
| POST | `/api/v1/demo/create-student` | إضافة طالب تجريبي |
| POST | `/api/v1/demo/create-teacher` | إضافة معلم تجريبي |
| DELETE | `/api/v1/demo/reset` | حذف جميع البيانات |

---

## 🎯 سيناريو تجريبي كامل:

### الخطوة 1: تحقق من الإحصائيات الحالية
```
افتح: http://localhost:5000/api/v1/demo/stats
```

### الخطوة 2: أضف 3 طلاب
استخدم Thunder Client أو PowerShell لإرسال POST على:
```
http://localhost:5000/api/v1/demo/create-student
```
كرر العملية 3 مرات

### الخطوة 3: أضف 2 معلمين
```
http://localhost:5000/api/v1/demo/create-teacher
```
كرر مرتين

### الخطوة 4: شاهد النتائج
```
http://localhost:5000/api/v1/demo/students
http://localhost:5000/api/v1/demo/teachers
http://localhost:5000/api/v1/demo/stats
```

### الخطوة 5: افتح Prisma Studio
```bash
npx prisma studio
```
استكشف الجداول:
- `User` - جميع المستخدمين
- `Profile` - الملفات الشخصية
- `Student` - بيانات الطلاب
- `Teacher` - بيانات المعلمين
- `QuranProgress` - سجل تقدم القرآن
- `NooraniProgress` - سجل القاعدة النورانية

### الخطوة 6: نظف البيانات
عند الانتهاء:
```
DELETE: http://localhost:5000/api/v1/demo/reset
```

---

## 💡 نصائح:

1. **كل طالب تم إنشاؤه يحصل على:**
   - إيميل فريد: `student{timestamp}@test.com`
   - كلمة مرور: `123456`
   - كود طالب: `STD-{timestamp}`
   - ملف شخصي كامل
   - سجل تقدم القرآن
   - سجل القاعدة النورانية

2. **كل معلم تم إنشاؤه يحصل على:**
   - إيميل فريد: `teacher{timestamp}@test.com`
   - كلمة مرور: `123456`
   - تخصص: تحفيظ القرآن الكريم
   - سنوات خبرة: 5

3. **لمشاهدة الأخطاء:**
   - راقب نافذة CMD التي يعمل فيها الخادم
   - ستشاهد جميع الطلبات والأخطاء

4. **لإيقاف الخادم:**
   - اضغط `Ctrl + C` في نافذة CMD

---

## 🚀 الخطوات التالية:

بعد التجربة، يمكنك:

1. **بناء واجهة المستخدم (Frontend)**
   - راجع ملف `FRONTEND_GUIDE.md`

2. **إضافة المسارات الحقيقية:**
   - تسجيل الدخول (Authentication)
   - إدارة الطلاب والمعلمين
   - نظام التقييم
   - الرسائل والإشعارات

3. **تخصيص البيانات:**
   - عدل `demo.routes.ts` لتخصيص البيانات التجريبية

---

## ❓ مشاكل شائعة:

### المتصفح يعرض خطأ "Can't reach this page"
- تأكد أن الخادم يعمل (شغل `npm run dev`)
- تأكد من الرابط: `http://localhost:5000` وليس `https`

### خطأ في قاعدة البيانات
- تأكد أن PostgreSQL يعمل
- تحقق من الاتصال: `http://localhost:5000/health`

### Thunder Client لا يعمل
- استخدم PowerShell بدلاً منه
- أو استخدم Prisma Studio مباشرة

---

**الآن ابدأ التجربة! 🎉**

افتح المتصفح واذهب إلى: `http://localhost:5000/api/v1/demo/stats`
