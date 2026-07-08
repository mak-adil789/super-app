# 🕋 Super App - Feature Implementation Sheet

This document contains a comprehensive, step-by-step feature implementation roadmap, breaking down the application modules into sub-modules, architectural tasks, database schemas, frontend components, and backend endpoints.

---

# 🚀 Phase 1: MVP Core Modules

## 1. Authentication & Session Module
*Handles user signups, credentials, multi-platform OAuth, and secure session management.*

### 🛠️ Sub-Module 1.1: Firebase Authentication (Mobile & Backend Integration)
- **Tasks:**
  - `[ ]` Install Firebase SDK in `mobile` workspace and initialize config.
  - `[ ]` Create Zustand auth store (`mobile/src/store/useAuthStore.js`) tracking current logged-in user profile, access token, and status.
  - `[ ]` Design registration/login screen UI using Tailwind CSS grid layouts and input fields.
  - `[ ]` Implement standard Email/Password authentication flow.
  - `[ ]` Integrate Google Sign-In and Apple Sign-In credentials parsing using native Expo prompt.
  - `[ ]` Add custom JWT verification middleware on `server` to validate Firebase tokens:
    - Route protection validation: `verifyToken(req, res, next)`.
  - `[ ]` Set up database seed scripts for seeding initial configurations.
- **Database Schema (Prisma - `User` model):**
  ```prisma
  model User {
    id         String      @id @default(uuid())
    firebaseId String      @unique
    email      String      @unique
    name       String?
    avatarUrl  String?
    createdAt  DateTime    @default(now())
    updatedAt  DateTime    @updatedAt
  }
  ```
- **Target Files:**
  - `mobile/src/store/useAuthStore.js`
  - `mobile/src/app/auth/login.jsx`
  - `mobile/src/app/auth/register.jsx`
  - `server/src/middleware/auth.js`

---

## 2. Prayer Times & Notification Module
*Calculates and displays daily prayers times based on coordinates, handles computation methods, and schedules local notifications.*

### 🛠️ Sub-Module 2.1: Prayer Calculation & Offline Storage
- **Tasks:**
  - `[ ]` Set up Expo Location sensor tracking to retrieve user lat/long.
  - `[ ]` Build API client integration to fetch monthly times from AlAdhan API.
  - `[ ]` Save fetched prayer times locally in SQLite (`expo-sqlite` or `MMKV`) to support 100% offline access.
  - `[ ]` Implement local calculation fallback algorithms using `adhan` package when API request fails.
  - `[ ]` Create Zustand state manager (`usePrayerStore.js`) for countdown timer to the next prayer.
- **Target Files:**
  - `mobile/src/services/prayerApi.js`
  - `mobile/src/store/usePrayerStore.js`
  - `mobile/src/utils/sqliteDb.js`

### 🛠️ Sub-Module 2.2: Qibla Compass
- **Tasks:**
  - `[ ]` Implement device magnetometer subscription in `useQiblaCompass` hook using `expo-sensors`.
  - `[ ]` Calculate Qibla angle relative to true north using location coordinate formula (Great Circle distance).
  - `[ ]` Design compass needle and casing using Tailwind CSS rotation styles, with micro-animations.
  - `[ ]` Add haptic feedback vibrator alert when pointing exactly to Kaaba.
- **Target Files:**
  - `mobile/src/hooks/useQiblaCompass.js`
  - `mobile/src/app/prayer/qibla.jsx`

---

## 3. Quran Reader Module
*Renders Arabic surahs, translations, bookmarks, and manages reading progress.*

### 🛠️ Sub-Module 3.1: Surah Index & Verses Reader
- **Tasks:**
  - `[ ]` Integrate Quran.com REST endpoints to fetch Surah indices, Arabic text (Uthmani script), and multiple translation sets (English, Urdu, Indonesian).
  - `[ ]` Build list view layouts for all 114 Surahs with bookmarks count in list items.
  - `[ ]` Create a highly optimized virtualized reader UI (`mobile/src/app/quran/[id].jsx`) to render verses without frame drops on low-end devices.
  - `[ ]` Add custom controls to adjust text sizing, toggle translations, and view Tafsir cards.
- **Database Schema (Prisma - `QuranBookmark` & `QuranProgress` models):**
  ```prisma
  model QuranBookmark {
    id        String   @id @default(uuid())
    userId    String
    surahId   Int
    verseId   Int
    createdAt DateTime @default(now())
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }

  model QuranProgress {
    id         String   @id @default(uuid())
    userId     String
    lastSurah  Int
    lastVerse  Int
    percentage Float
    updatedAt  DateTime @updatedAt
    user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  ```
- **Target Files:**
  - `mobile/src/app/quran/index.jsx`
  - `mobile/src/app/quran/[id].jsx`
  - `server/src/controllers/quranController.js`

---

## 4. Daily Hadith & Dua Library
*Provides daily cards containing verified Hadiths and categorizes Duas.*

### 🛠️ Sub-Module 4.1: Dua Book & Daily Hadith Widgets
- **Tasks:**
  - `[ ]` Create static JSON datasets containing dua categories (Morning, Evening, After Prayer, Travel).
  - `[ ]` Build home widget fetching daily random Hadith from Sunnah API.
  - `[ ]` Set up search functionality in the library.
- **Target Files:**
  - `mobile/src/assets/data/duas.json`
  - `mobile/src/components/DuaCategoryCard.jsx`
  - `mobile/src/app/duas/index.jsx`

---

## 5. Digital Tasbeeh Counter
*Simple digital counter for dhikr repetitions.*

### 🛠️ Sub-Module 5.1: Digital Counter & Goals
- **Tasks:**
  - `[ ]` Create dynamic round screen layout containing counter state.
  - `[ ]` Integrate haptic pulse trigger using `expo-haptics` on each increment tap.
  - `[ ]` Save daily tasbeeh counts to local database store.
- **Target Files:**
  - `mobile/src/app/tasbeeh/index.jsx`
  - `mobile/src/store/useTasbeehStore.js`

---

# 📅 Phase 2: User Support & Calculations

## 6. Mosque Locator (Maps Integration)
*Displays nearby mosques, parking, and Friday prayer times.*

### 🛠️ Sub-Module 6.1: Google Maps Integration
- **Tasks:**
  - `[ ]` Set up Google Maps API credentials on Android/iOS native environments.
  - `[ ]` Integrate `react-native-maps` rendering current position markers.
  - `[ ]` Call nearby mosques text search API endpoint on the backend.
  - `[ ]` Create sheet preview overlays showing Friday prayer times and reviews on tap.
- **Target Files:**
  - `mobile/src/app/mosque/locator.jsx`
  - `server/src/controllers/mosqueController.js`

---

## 7. Zakat Calculator & Exporter
*Enables cash, gold, and assets evaluations, and outputs PDF reports.*

### 🛠️ Sub-Module 7.1: Calculator Calculations & PDF Engine
- **Tasks:**
  - `[ ]` Design multi-field forms capturing cash, gold, silver, investments, and liabilities.
  - `[ ]` Build mathematical calculator logic checking threshold criteria (Nisab) using live silver/gold prices API.
  - `[ ]` Implement backend endpoint generating PDF documents using `pdfkit`.
- **Target Files:**
  - `mobile/src/app/zakat/calculator.jsx`
  - `server/src/services/pdfGenerator.js`

---

## 8. Ramadan Mode
*Activates during Ramadan showing Sehri/Iftar countdowns, fasting tracker, and calendars.*

### 🛠️ Sub-Module 8.1: Fasting Calendars & Planners
- **Tasks:**
  - `[ ]` Build auto-activation conditional triggers checking Hijri dates.
  - `[ ]` Add widgets displaying Sehri and Iftar countdown alerts on home screens.
  - `[ ]` Create checklists for Taraweeh, Quran reading progress, and daily charity tracking.
- **Target Files:**
  - `mobile/src/components/RamadanDashboard.jsx`
  - `mobile/src/app/ramadan/index.jsx`

---

# 👥 Phase 3: Social & Admin Panel

## 9. Family Accounts Dashboard
*Allows multiple linked user accounts to view shared progress and set group goals.*

### 🛠️ Sub-Module 9.1: Family Linkage & Shared Goals
- **Tasks:**
  - `[ ]` Build group creator forms in settings page.
  - `[ ]` Create API handlers validating invitation tokens.
  - `[ ]` Implement group progress checklists.
- **Database Schema (Prisma - `Family` association):**
  ```prisma
  model Family {
    id        String   @id @default(uuid())
    name      String
    inviteCode String  @unique
    members   User[]
    createdAt DateTime @default(now())
  }
  ```
- **Target Files:**
  - `server/src/controllers/familyController.js`
  - `mobile/src/app/profile/family.jsx`

---

## 10. Admin Control Panel
*Management dashboard for moderating lectures, announcements, content, and events.*

### 🛠️ Sub-Module 10.1: Control Center API
- **Tasks:**
  - `[ ]` Create backend routes verifying `role: 'ADMIN'` authorizations.
  - `[ ]` Build CRUD routes managing catalog tables (Surahs, Duas, Events, Lectures).
- **Target Files:**
  - `server/src/routes/admin.js`
  - `server/src/middleware/checkAdmin.js`

---

# 🤖 Phase 4: AI-Assisted Features

## 11. AI Assistant & Quran Tutor Chat
*Integrated LLM assistant answering religious rulings and supporting memorizations.*

### 🛠️ Sub-Module 11.1: Gemini AI Conversation
- **Tasks:**
  - `[ ]` Setup Gemini API SDK clients on backend controllers.
  - `[ ]` Build context prompt wrappers instructing models on style, Tafsir books, and safe outputs.
  - `[ ]` Create streaming responses with auto-scrolling chat interfaces.
- **Target Files:**
  - `server/src/services/geminiClient.js`
  - `mobile/src/app/ai/chat.jsx`

---

## 12. AI OCR Scanning & Speech
*Scans physical prayer timetables and processes text/voice inputs.*

### 🛠️ Sub-Module 12.1: OCR Timetable Extraction
- **Tasks:**
  - `[ ]` Integrate `expo-camera` capturing photos.
  - `[ ]` Upload captured snapshots to backend and parse images using Gemini Vision or Google Cloud Vision API.
  - `[ ]` Save parsed calendar dates directly to the user's localized SQLite table.
- **Target Files:**
  - `mobile/src/app/ai/ocr-scanner.jsx`
  - `server/src/controllers/ocrController.js`

---

# 🌍 Phase 5: Hajj/Umrah

## 13. Hajj & Umrah Guide
*Provides step-by-step interactive instructions and maps.*

### 🛠️ Sub-Module 13.1: Interactive Ritual Maps
- **Tasks:**
  - `[ ]` Create step indicators mapping Hajj rituals (Tawaf, Sa'ee, Arafat, Mina).
  - `[ ]` Integrate audio guides explaining supplications during circumambulation steps.
- **Target Files:**
  - `mobile/src/app/hajj/guide.jsx`
  - `mobile/src/components/AudioGuidePlayer.jsx`

---
