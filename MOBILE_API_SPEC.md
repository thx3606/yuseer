# Mobile API Specification (v1.0)
## Yuoser SaaS Platform - Flutter App Integration

This document outlines the API endpoints required for the Yuoser Flutter mobile application. The mobile app serves three primary user roles: **Teacher (المعلم)**, **Guardian (ولي الأمر)**, and **Student (الطالب)**.

> **Note:** All requests must include the `Authorization: Bearer <JWT_TOKEN>` header.

---

## 1. Authentication (`/api/v1/auth`)
Handles login across all roles.

- **POST `/mobile/login`**
  - **Body:** `{ "phone": "string", "pin": "string" }`
  - **Response:** `{ "token": "jwt", "user": { "role": "TEACHER", "tenantId": "uuid", "name": "..." } }`
  - *Note: We use phone + PIN for easier mobile access compared to email/password.*

- **GET `/me`**
  - Retrieves the current logged-in user's profile and permissions.

---

## 2. Teacher Endpoints (`/api/v1/mobile/teachers`)
Used by teachers to manage their daily classes and evaluations on iPads/Phones.

- **GET `/classes/today`**
  - **Response:** List of today's assigned classes with timing.

- **GET `/classes/:classId/students`**
  - **Response:** List of students enrolled in the class with their current memorization progress.

- **POST `/evaluations`** (Daily Grading)
  - **Body:** 
    ```json
    {
      "studentId": "uuid",
      "classId": "uuid",
      "date": "2024-03-20",
      "attendance": "PRESENT",
      "memorization": { "surah": "Al-Baqarah", "fromAyah": 1, "toAyah": 20, "grade": 5 },
      "tajweedErrors": ["المدود", "القلقلة"],
      "notes": "ممتاز جداً"
    }
    ```
  - **Response:** `{ "success": true, "evaluationId": "123" }`

---

## 3. Guardian Endpoints (`/api/v1/mobile/guardians`)
Used by parents to track their children's progress.

- **GET `/children`**
  - **Response:** List of linked students (children) for this guardian.

- **GET `/children/:studentId/progress`**
  - **Response:** Daily evaluations, attendance records, and overall memorization percentage.

- **GET `/children/:studentId/exams`**
  - **Response:** Upcoming and past exam results.

- **POST `/leave-requests`**
  - **Body:** `{ "studentId": "uuid", "date": "2024-03-21", "reason": "Sick" }`
  - **Response:** Success status.

---

## 4. Notifications & Messaging (`/api/v1/mobile/messages`)
- **GET `/inbox`**
  - Retrieves unread messages and notifications.
- **POST `/send`**
  - Send a message to a teacher (if guardian) or to parents (if teacher).

---

## Technical Considerations for Flutter
1. **Offline Capability:** Flutter app should use `sqflite` or `hive` to cache the student list for teachers, allowing them to take attendance even if the internet drops in the mosque.
2. **Push Notifications:** Integrate Firebase Cloud Messaging (FCM). Send device tokens to `POST /api/v1/users/device-token`.
3. **Tenant Context:** The JWT token already contains the `tenantId`. The backend middleware `withTenant` automatically filters all records, so the mobile app doesn't need to specify it.
