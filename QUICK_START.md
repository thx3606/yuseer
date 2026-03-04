# 🚀 دليل البدء السريع | Quick Start Guide

---

## 📋 المتطلبات | Prerequisites

قبل البدء، تأكد من تثبيت:

- ✅ **Node.js** v18 أو أحدث - [تحميل](https://nodejs.org/)
- ✅ **PostgreSQL** v14 أو أحدث - [تحميل](https://www.postgresql.org/download/)
- ✅ **Git** - [تحميل](https://git-scm.com/)
- ⚡ **Redis** (اختياري للأداء الأفضل) - [تحميل](https://redis.io/download/)

---

## ⚡ التثبيت السريع | Quick Installation

### 1️⃣ تثبيت التبعيات

```bash
# تثبيت تبعيات Backend
cd backend
npm install

# العودة للجذر
cd ..
```

### 2️⃣ إعداد قاعدة البيانات

#### إنشاء قاعدة البيانات في PostgreSQL

```sql
-- افتح PostgreSQL وأنشئ قاعدة البيانات
CREATE DATABASE quran_schools;
```

#### أو عبر سطر الأوامر:

```bash
# Windows (من PostgreSQL bin folder)
createdb -U postgres quran_schools

# Linux/Mac
sudo -u postgres createdb quran_schools
```

### 3️⃣ إعداد ملف البيئة

```bash
# انسخ ملف البيئة النموذجي
cd backend
cp .env.example .env
```

عدّل ملف `.env` وغيّر هذه القيم:

```env
# قاعدة البيانات
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/quran_schools?schema=public"

# المفاتيح السرية - غيّرها إلى قيم عشوائية طويلة
JWT_SECRET=your_very_long_and_random_secret_key_here_at_least_32_characters
JWT_REFRESH_SECRET=another_very_long_random_secret_key_for_refresh_tokens

# البريد الإلكتروني (Gmail مثال)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password  # استخدم App Password من Google
```

### 4️⃣ تشغيل Migration

```bash
# من مجلد backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ إنشاء بيانات تجريبية (اختياري)

```bash
# سيتم إنشاء حساب المدير وبيانات تجريبية
npm run seed
```

الحساب الافتراضي:
- **البريد**: `admin@quranschools.com`
- **كلمة المرور**: `Admin@123`

### 6️⃣ تشغيل الخادم

```bash
# بيئة التطوير (مع Hot Reload)
npm run dev

# أو بيئة الإنتاج
npm run build
npm start
```

✅ الخادم يعمل الآن على: **http://localhost:5000**

---

## 🧪 اختبار التثبيت

### 1. فحص الصحة (Health Check)

افتح المتصفح أو استخدم curl:

```bash
curl http://localhost:5000/health
```

يجب أن تحصل على:
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "database": "connected",
    "server": "running"
  }
}
```

### 2. اختبار API

```bash
curl http://localhost:5000/api/v1/test
```

---

## 📱 الاستخدام الأساسي

### تسجيل الدخول

```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@quranschools.com",
  "password": "Admin@123"
}
```

### إنشاء مستخدم جديد

```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "email": "teacher@school.com",
  "password": "SecurePass123",
  "role": "TEACHER",
  "firstName": "أحمد",
  "lastName": "محمد",
  "phoneNumber": "+966501234567"
}
```

---

## 🛠️ أدوات مفيدة

### Prisma Studio - واجهة قاعدة البيانات

```bash
cd backend
npx prisma studio
```

يفتح على: **http://localhost:5555**

### إعادة إنشاء قاعدة البيانات

```bash
# احذر: هذا سيحذف جميع البيانات!
cd backend
npx prisma migrate reset
```

---

## 📊 البيانات الافتراضية (بعد Seed)

### الحسابات

| الدور | البريد | كلمة المرور |
|------|--------|-------------|
| مدير النظام | admin@quranschools.com | Admin@123 |
| معلم | teacher@school.com | Teacher@123 |
| طالب | student@school.com | Student@123 |

### الجمعيات
- ✅ جمعية تحفيظ القرآن الكريم
- ✅ مدرسة النور للبنين
- ✅ فصل المستوى الأول

---

## ⚙️ إعدادات متقدمة (اختياري)

### تفعيل واتساب (Twilio)

1. سجّل في [Twilio](https://www.twilio.com/)
2. احصل على:
   - Account SID
   - Auth Token
   - WhatsApp Number

3. أضف في `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_ENABLED=true
```

### تفعيل Redis (للأداء الأفضل)

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🐛 حل المشاكل الشائعة

### خطأ في الاتصال بقاعدة البيانات

```
Error: Can't reach database server
```

**الحل:**
- ✅ تأكد من تشغيل PostgreSQL
- ✅ تحقق من اسم المستخدم وكلمة المرور في `DATABASE_URL`
- ✅ تأكد من إنشاء قاعدة البيانات

### خطأ في Prisma

```
Error: P1001: Can't reach database server
```

**الحل:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Port 5000 محجوز

**الحل:** غيّر المنفذ في `.env`:
```env
PORT=5001
```

---

## 📚 الخطوات التالية

بعد تشغيل النظام بنجاح:

1. 📖 اقرأ [التوثيق الكامل](./DOCUMENTATION_AR.md)
2. 🎨 استكشف [Prisma Studio](http://localhost:5555)
3. 🔧 راجع [API Documentation](./API_DOCS.md)
4. 💻 ابدأ تطوير Frontend

---

## 🆘 الدعم

إذا واجهت أي مشكلة:

1. راجع ملفات السجلات في `backend/logs/`
2. تحقق من [التوثيق الكامل](./DOCUMENTATION_AR.md)
3. افحص ملف `.env` للتأكد من صحة الإعدادات

---

## ✨ نصائح الأداء

### لبيئة التطوير
- ✅ استخدم `npm run dev` للـ Hot Reload
- ✅ فعّل Prisma Studio لمتابعة البيانات
- ✅ راجع ملفات Logs باستمرار

### لبيئة الإنتاج
- ✅ استخدم `npm run build && npm start`
- ✅ فعّل Redis للتخزين المؤقت
- ✅ استخدم Nginx كـ Reverse Proxy
- ✅ فعّل HTTPS
- ✅ راقب السجلات والأخطاء

---

## 🎯 الميزات الجاهزة للاستخدام

بعد التثبيت، يمكنك مباشرة:

- ✅ تسجيل الدخول
- ✅ إنشاء جمعيات ومدارس
- ✅ إضافة معلمين وطلاب
- ✅ إنشاء فصول دراسية
- ✅ تقييم الطلاب
- ✅ إرسال الرسائل
- ✅ توليد التقارير
- ✅ إصدار الشهادات

---

**بالتوفيق! وفقكم الله لما يحب ويرضى** 🤲

---

## 📞 معلومات الاتصال

- 📧 Email: support@quranschools.com
- 🌐 Website: https://quranschools.com
- 📚 Documentation: [DOCUMENTATION_AR.md](./DOCUMENTATION_AR.md)
