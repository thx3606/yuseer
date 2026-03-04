# 🚀 ابدأ من هنا | START HERE

---

## الحل السريع لمشكلة PowerShell

### افتح PowerShell كمسؤول وشغّل:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

اضغط **Y** ثم Enter

---

## التثبيت في 5 خطوات فقط

### 1️⃣ حل مشكلة سياسة التنفيذ (مرة واحدة فقط)

افتح **PowerShell كمسؤول** (Run as Administrator) ونفذ:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2️⃣ تثبيت التبعيات

افتح PowerShell عادي وانتقل لمجلد المشروع:

```powershell
cd C:\Users\Mazen\Desktop\yuoser\backend
npm install --legacy-peer-deps
```

⏳ **انتظر 5-10 دقائق**

### 3️⃣ إنشاء قاعدة البيانات

افتح **SQL Shell (psql)** من قائمة Start:

1. اضغط Enter عدة مرات (للإعدادات الافتراضية)
2. أدخل كلمة مرور PostgreSQL
3. اكتب:

```sql
CREATE DATABASE quran_schools;
```

4. اكتب `\q` للخروج

### 4️⃣ إعداد ملف البيئة

في PowerShell:

```powershell
# انسخ ملف البيئة
Copy-Item .env.example .env

# افتح الملف للتعديل
notepad .env
```

**عدّل السطر التالي فقط:**

```env
DATABASE_URL="postgresql://postgres:كلمة_المرور@localhost:5432/quran_schools?schema=public"
```

غيّر `كلمة_المرور` إلى كلمة مرور PostgreSQL الخاصة بك

احفظ الملف (Ctrl+S)

### 5️⃣ تشغيل النظام

```powershell
# إنشاء الجداول
npx prisma migrate dev --name init
npx prisma generate

# تشغيل الخادم
npm run dev
```

---

## ✅ اختبر النظام

افتح المتصفح:

- http://localhost:5000 ← يجب أن ترى رسالة ترحيب
- http://localhost:5000/health ← يجب أن ترى "healthy"

---

## 🐛 المشاكل الشائعة

### مشكلة: "cannot be loaded because running scripts is disabled"

**الحل:**

```powershell
# افتح PowerShell كمسؤول
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### مشكلة: "Can't reach database"

**الحل:**

1. تأكد أن PostgreSQL يعمل:
   - اضغط `Win + R`
   - اكتب `services.msc`
   - ابحث عن `postgresql`
   - تأكد أنه **Running**

2. تأكد من كلمة المرور في ملف `.env`

---

### مشكلة: "Port 5000 already in use"

**الحل:**

```powershell
# غيّر المنفذ في ملف .env
notepad .env

# أضف هذا السطر:
PORT=5001
```

---

### مشكلة: "Cannot find module"

**الحل:**

```powershell
# احذف وأعد التثبيت
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

---

## 📚 المزيد من المساعدة

- [دليل التثبيت الكامل على Windows](INSTALL_WINDOWS.md)
- [التوثيق الشامل](DOCUMENTATION_AR.md)
- [دليل البدء السريع](QUICK_START.md)

---

## 🎯 بعد التثبيت الناجح

1. جرّب Prisma Studio:
   ```powershell
   npx prisma studio
   ```
   افتح: http://localhost:5555

2. اقرأ التوثيق الكامل: [DOCUMENTATION_AR.md](DOCUMENTATION_AR.md)

3. ابدأ ببناء الواجهة الأمامية: [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)

---

**بالتوفيق! 🌟**

إذا واجهت أي مشكلة، راجع ملف [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md) للحلول التفصيلية.
