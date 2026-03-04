# 🚀 دليل بناء جميع التطبيقات
# Complete Applications Building Guide

## نظام إدارة مدارس تحفيظ القرآن الكريم
## Quranic Schools Management System

---

## 📋 المحتويات | Table of Contents

1. [نظرة عامة](#overview)
2. [المتطلبات الأساسية](#requirements)
3. [تطبيق الويب - Next.js](#web-app)
4. [تطبيق ويندوز - Electron](#windows-app)
5. [تطبيق أندرويد - React Native](#android-app)
6. [التشغيل والاختبار](#testing)

---

## 🎯 نظرة عامة | Overview

سنقوم ببناء **3 تطبيقات** كاملة متكاملة:

1. **📱 تطبيق ويب** (Next.js + TypeScript + Tailwind CSS)
2. **💻 تطبيق ويندوز** (Electron + React + TypeScript)
3. **📲 تطبيق أندرويد** (React Native + TypeScript)

جميع التطبيقات تتصل بنفس **Backend API** الموجود بالفعل.

---

## ⚙️ المتطلبات الأساسية | Requirements

### للجميع:
- Node.js v18 أو أحدث
- npm أو yarn
- Git

### لتطبيق ويندوز:
- Visual Studio Build Tools

### لتطبيق أندرويد:
- Android Studio
- Java JDK 11+
- Android SDK

---

## 1️⃣ تطبيق الويب | Web Application

### التقنيات المستخدمة:
- **Next.js 15** - إطار عمل React
- **TypeScript** - للأمان النوعي
- **Tailwind CSS** - للتنسيق
- **Axios** - لإرسال الطلبات
- **React Query** - لإدارة البيانات

### خطوات التنفيذ:

#### 1. إنشاء المشروع:

```powershell
cd c:\Users\Mazen\Desktop\yuoser
npx create-next-app@latest web-app --typescript --tailwind --app --eslint
```

اختر الإعدادات التالية:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ❌ Src Directory
- ✅ Import Alias (@/*)

#### 2. تثبيت المكتبات الإضافية:

```powershell
cd web-app
npm install axios @tanstack/react-query lucide-react clsx tailwind-merge
```

#### 3. هيكل المشروع:

```
web-app/
├── app/
│   ├── page.tsx              # صفحة تسجيل الدخول
│   ├── admin/
│   │   └── page.tsx          # لوحة تحكم المدير
│   ├── teacher/
│   │   └── page.tsx          # بوابة المعلم
│   ├── student/
│   │   └── page.tsx          # بوابة الطالب
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Card.tsx
│   └── Button.tsx
├── lib/
│   ├── api.ts                # وظائف API
│   └── utils.ts
├── public/
├── next.config.js
├── tailwind.config.ts
└── package.json
```

#### 4. التطبيق جاهز!

الملفات الكاملة موجودة في الدليل الشامل.

للتشغيل:
```powershell
npm run dev
```

افتح المتصفح: `http://localhost:3000`

---

## 2️⃣ تطبيق ويندوز | Windows Desktop App

### التقنيات المستخدمة:
- **Electron** - لإنشاء تطبيقات سطح المكتب
- **React** - للواجهة
- **TypeScript**
- **Electron Builder** - لبناء ملف exe

### خطوات التنفيذ:

#### 1. إنشاء المشروع:

```powershell
cd c:\Users\Mazen\Desktop\yuoser
mkdir windows-app
cd windows-app
npm init -y
```

#### 2. تثبيت المكتبات:

```powershell
npm install electron react react-dom
npm install -D @types/react @types/react-dom @types/node
npm install -D typescript webpack webpack-cli html-webpack-plugin
npm install -D electron-builder
```

#### 3. هيكل المشروع:

```
windows-app/
├── src/
│   ├── main.ts               # Electron Main Process
│   ├── App.tsx               # React App
│   ├── App.css
│   └── index.html
├── assets/
│   └── icon.ico
├── dist/                     # ملفات البناء
├── release/                  # ملف exe النهائي
├── package.json
├── tsconfig.json
└── webpack.config.js
```

#### 4. البناء والتشغيل:

```powershell
# للتطوير
npm run dev

# لبناء ملف exe
npm run build
```

ستجد ملف `.exe` في مجلد `release/`

---

## 3️⃣ تطبيق أندرويد | Android Mobile App

### التقنيات المستخدمة:
- **React Native** - لبناء تطبيقات الجوال
- **TypeScript**
- **React Navigation** - للتنقل بين الشاشات
- **Axios** - للاتصال بالـ API

### المتطلبات الإضافية:

#### 1. تثبيت Android Studio:
- حمّل Android Studio من: https://developer.android.com/studio
- ثبّت Android SDK
- ثبّت Android Emulator

#### 2. تثبيت Java JDK:
```powershell
# تحقق من التثبيت
java -version
```

#### 3. ضبط متغيرات البيئة:
```
ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Java\jdk-11
```

### خطوات التنفيذ:

#### 1. إنشاء المشروع:

```powershell
cd c:\Users\Mazen\Desktop\yuoser
npx react-native init QuranSchoolApp --template react-native-template-typescript
```

#### 2. تثبيت المكتبات:

```powershell
cd QuranSchoolApp
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios
```

#### 3. هيكل المشروع:

```
QuranSchoolApp/
├── android/                  # ملفات Android
├── ios/                      # ملفات iOS
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── TeacherScreen.tsx
│   │   └── StudentScreen.tsx
│   ├── components/
│   ├── navigation/
│   └── api/
├── App.tsx
└── package.json
```

#### 4. التشغيل:

```powershell
# تشغيل Metro Bundler
npx react-native start

# في نافذة PowerShell أخرى
npx react-native run-android
```

---

## 🧪 التشغيل والاختبار | Testing & Running

### 1. تشغيل Backend (مطلوب للجميع):

```powershell
cd c:\Users\Mazen\Desktop\yuoser\backend
npm run dev
```

يجب أن ترى: `✓ Server is running on http://localhost:5000`

### 2. تشغيل تطبيق الويب:

```powershell
cd c:\Users\Mazen\Desktop\yuoser\web-app
npm run dev
```

افتح: `http://localhost:3000`

### 3. تشغيل تطبيق ويندوز:

```powershell
cd c:\Users\Mazen\Desktop\yuoser\windows-app
npm run dev
```

### 4. تشغيل تطبيق أندرويد:

```powershell
# Terminal 1
cd c:\Users\Mazen\Desktop\yuoser\QuranSchoolApp
npx react-native start

# Terminal 2
npx react-native run-android
```

---

## 🔐 حسابات الاختبار | Test Accounts

```
المدير:
Email: admin@albirr.com
Password: 123456

المعلم:
Email: teacher@albirr.com
Password: 123456

الطالب:
Email: student@albirr.com
Password: 123456
```

---

## 📦 البناء للإنتاج | Production Build

### تطبيق الويب:
```powershell
npm run build
npm start
```

### تطبيق ويندوز:
```powershell
npm run build
# ستجد ملف .exe في release/
```

### تطبيق أندرويد:
```powershell
cd android
./gradlew assembleRelease
# ستجد ملف .apk في:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎨 الميزات الموجودة في جميع التطبيقات

✅ تسجيل الدخول
✅ لوحات تحكم متعددة (مدير، معلم، طالب)
✅ عرض الإحصائيات
✅ إدارة الطلاب
✅ إدارة الحلقات
✅ نظام التسميع
✅ التقارير
✅ الإشعارات

---

## 📝 ملاحظات هامة | Important Notes

1. **Backend أولاً**: تأكد من تشغيل Backend قبل أي تطبيق
2. **للأندرويد**: استخدم `10.0.2.2` بدلاً من `localhost` في الـ Emulator
3. **Firewall**: قد تحتاج السماح للتطبيقات في الـ Firewall
4. **التطوير**: جميع التطبيقات في وضع التطوير لسهولة التعديل

---

## 🆘 حل المشاكل الشائعة | Troubleshooting

### مشكلة: Backend لا يعمل
```powershell
# تأكد من PostgreSQL يعمل
# ثم:
cd backend
npm install
npm run dev
```

### مشكلة: تطبيق الويب لا يتصل بالـ API
```javascript
// في next.config.js تأكد من:
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:5000/api/:path*',
    },
  ]
}
```

### مشكلة: Android Emulator لا يعمل
```powershell
# تأكد من Android SDK مثبت
# تأكد من ANDROID_HOME في متغيرات البيئة
# افتح Android Studio وأنشئ Emulator جديد
```

---

## 📚 المزيد من الموارد

- [الوثائق الكاملة](./COMPREHENSIVE_DESIGN_DOCUMENT.md)
- [دليل التثبيت](./INSTALL_WINDOWS.md)
- [دليل الاختبار السريع](./QUICK_TEST_GUIDE.md)

---

## 📞 الدعم | Support

إذا واجهت أي مشكلة:
1. راجع هذا الدليل
2. تحقق من ملفات الأخطاء في console
3. تأكد من تشغيل Backend أولاً

---

**🕌 بارك الله فيكم**
**May Allah Bless Your Efforts**

---

**تم التحديث:** 21 فبراير 2026
**النسخة:** 1.0.0
