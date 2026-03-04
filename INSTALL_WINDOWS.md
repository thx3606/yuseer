# 🪟 دليل التثبيت على Windows

## ⚠️ حل مشكلة سياسة التنفيذ (Execution Policy)

### الطريقة الأولى (موصى بها):

1. افتح **PowerShell كمسؤول** (Run as Administrator)
2. نفذ الأمر التالي:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

3. اضغط **Y** للموافقة

### الطريقة الثانية (مؤقتة):

في كل مرة تفتح فيها PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

---

## 📦 التثبيت خطوة بخطوة

### 1️⃣ تثبيت المتطلبات الأساسية

تأكد من تثبيت:
- ✅ [Node.js v18+](https://nodejs.org/)
- ✅ [PostgreSQL v14+](https://www.postgresql.org/download/windows/)
- ✅ [Git](https://git-scm.com/download/win)

### 2️⃣ فتح PowerShell

```powershell
# انتقل لمجلد المشروع
cd C:\Users\Mazen\Desktop\yuoser\backend
```

### 3️⃣ تثبيت التبعيات

```powershell
# حذف node_modules و package-lock.json إذا وُجدوا
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# تثبيت التبعيات
npm install --legacy-peer-deps
```

⏳ **ملاحظة**: قد يستغرق التثبيت 5-10 دقائق

### 4️⃣ إعداد PostgreSQL

#### افتح PowerShell كمسؤول وأنشئ قاعدة البيانات:

```powershell
# الطريقة 1: عبر PowerShell (إذا كان PostgreSQL في PATH)
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE quran_schools;"

# الطريقة 2: عبر pgAdmin 4 (GUI)
# افتح pgAdmin → انقر يمين على Databases → Create → Database
# الاسم: quran_schools
```

#### أو استخدم SQL Shell:

1. افتح **SQL Shell (psql)**
2. اضغط Enter عدة مرات لقبول الإعدادات الافتراضية
3. أدخل كلمة مرور PostgreSQL
4. نفذ:

```sql
CREATE DATABASE quran_schools;
\q
```

### 5️⃣ إعداد ملف البيئة

```powershell
# انسخ ملف البيئة النموذجي
Copy-Item .env.example .env
```

**عدّل ملف `.env`** باستخدام محرر نصوص (مثل Notepad):

```env
# قاعدة البيانات
DATABASE_URL="postgresql://postgres:كلمة_المرور_هنا@localhost:5432/quran_schools?schema=public"

# المفاتيح السرية (غيّرها!)
JWT_SECRET=your_very_long_secret_key_at_least_32_characters_here
JWT_REFRESH_SECRET=another_long_secret_key_for_refresh_tokens

# البريد الإلكتروني (Gmail مثال)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# الواجهة الأمامية
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

⚠️ **مهم**: غيّر `كلمة_المرور_هنا` إلى كلمة مرور PostgreSQL الخاصة بك!

### 6️⃣ تشغيل Prisma Migration

```powershell
# إنشاء الجداول في قاعدة البيانات
npx prisma migrate dev --name init

# إنشاء Prisma Client
npx prisma generate
```

### 7️⃣ تشغيل الخادم

```powershell
# بيئة التطوير (مع Hot Reload)
npm run dev
```

✅ **نجح!** الخادم يعمل الآن على: **http://localhost:5000**

---

## 🧪 اختبار التثبيت

افتح متصفحك أو استخدم PowerShell:

```powershell
# اختبار الصحة
Invoke-WebRequest -Uri http://localhost:5000/health -UseBasicParsing | Select-Object -ExpandProperty Content

# اختبار API
Invoke-WebRequest -Uri http://localhost:5000/api/v1/test -UseBasicParsing | Select-Object -ExpandProperty Content
```

أو افتح المتصفح:
- http://localhost:5000
- http://localhost:5000/health
- http://localhost:5000/api/v1/test

---

## 🐛 حل المشاكل الشائعة

### مشكلة 1: "cannot be loaded because running scripts is disabled"

**الحل:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### مشكلة 2: "ECONNREFUSED" أو "Can't reach database"

**الحل:**
1. تأكد من تشغيل PostgreSQL:
   - افتح **Services** (اضغط Win+R واكتب `services.msc`)
   - ابحث عن **postgresql-x64-16** (أو النسخة المثبتة)
   - تأكد أنها **Running**

2. تحقق من كلمة المرور في `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/quran_schools"
   ```

### مشكلة 3: "Port 5000 already in use"

**الحل:**
```powershell
# ابحث عن البرنامج الذي يستخدم المنفذ
netstat -ano | findstr :5000

# أوقف العملية (استبدل PID برقم العملية)
taskkill /PID رقم_العملية /F

# أو غيّر المنفذ في .env
PORT=5001
```

### مشكلة 4: "Cannot find module"

**الحل:**
```powershell
# احذف وأعد التثبيت
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install --legacy-peer-deps
```

### مشكلة 5: "Prisma Client is not generated"

**الحل:**
```powershell
npx prisma generate
```

---

## 📊 أدوات مفيدة

### Prisma Studio (واجهة قاعدة البيانات)

```powershell
npx prisma studio
```

يفتح على: **http://localhost:5555**

### إعادة إنشاء قاعدة البيانات

```powershell
# ⚠️ احذر: هذا سيحذف جميع البيانات!
npx prisma migrate reset
```

---

## 🚀 الخطوات التالية

بعد نجاح التثبيت:

1. ✅ جرّب Prisma Studio
2. ✅ اقرأ [التوثيق الكامل](../DOCUMENTATION_AR.md)
3. ✅ ابدأ بناء الواجهة الأمامية

---

## 📝 ملاحظات Windows

### مسارات PowerShell
- استخدم `\` أو `\\` في المسارات
- أو استخدم `/` مع علامات اقتباس: `"C:/Users/..."`

### الأوامر البديلة

| Linux/Mac | Windows PowerShell |
|-----------|-------------------|
| `ls` | `Get-ChildItem` أو `dir` |
| `rm -rf` | `Remove-Item -Recurse -Force` |
| `cp` | `Copy-Item` |
| `cat` | `Get-Content` |
| `clear` | `Clear-Host` أو `cls` |

---

## 🆘 إذا استمرت المشاكل

1. تأكد من تثبيت Node.js v18+ بشكل صحيح
2. تأكد من تشغيل PostgreSQL
3. تحقق من ملف `.env`
4. راجع ملفات السجلات في `backend/logs/`

---

**بالتوفيق! 🌟**
