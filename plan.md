# 🕌 Muslim Super App
## Product Requirements Document (PRD) & Technical Architecture

> A modern Islamic lifestyle app built with **React Native (Expo)** and **Node.js/Express**, providing Muslims with daily religious tools, learning resources, family features, and AI-powered assistance.

---

# 1. Vision

Create the most comprehensive Islamic mobile application that serves Muslims every day—not only during Ramadan.

The app should become a daily companion by combining:

- Prayer
- Quran
- Learning
- Family
- Community
- Islamic Calendar
- Mosque Services
- AI Assistant
- Travel
- Donations
- Personal Growth

---

# 2. Technology Stack

## Mobile

- React Native (Expo)
- Expo Router
- React Query
- Zustand
- React Hook Form
- React Native Paper
- NativeWind (Tailwind CSS for React Native)
- Tailwind CSS
- React Native Maps
- Expo Notifications
- Expo Location
- Expo AV
- Expo Secure Store
- Expo SQLite
- MMKV
- Lottie

---

## Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL

Deployment

- Vercel

Database

- Neon PostgreSQL (Recommended)
- Supabase PostgreSQL

---

## Authentication

- Clerk
OR
- Firebase Authentication

Providers

- Google
- Apple
- Email
- Phone OTP

---

## Storage

- Supabase Storage
- Cloudinary

Used For

- Audio
- Videos
- Certificates
- Images

---

## Maps

Google Maps API

Features

- Mosque Locator
- Halal Restaurants
- Navigation
- Reverse Geocoding

Alternative

- Mapbox

---

## Notifications

- Expo Push Notifications

Used For

- Prayer reminders
- Daily Hadith
- Quran reminders
- Ramadan alerts
- Islamic events

---

# 3. APIs

## Prayer Times

- AlAdhan API

Provides

- Prayer Times
- Hijri Calendar
- Qibla Direction

---

## Quran

Quran.com API

Provides

- Arabic Text
- Translations
- Audio
- Tafsir

---

## Hadith

- Sunnah API

---

## Islamic Calendar

- AlAdhan Calendar API

---

## Moon Sighting

Possible Sources

- Moonsighting Committee
- Local Government APIs
- Manual Admin Updates

---

# 4. App Modules

---

# Home

## Widgets

Current Prayer

Next Prayer Countdown

Hijri Date

Today's Verse

Today's Hadith

Weather

Quick Actions

- Prayer
- Quran
- Tasbeeh
- Mosque
- Qibla
- Duas

---

# Prayer Module

Features

- Prayer Times
- Prayer Notifications
- Prayer Tracker
- Prayer History
- Prayer Streaks
- Prayer Analytics
- Qibla Compass
- Nearby Mosque
- Offline Prayer Times

AI Features

- Personalized reminders
- Detect missed prayers
- Prayer habit analysis
- Smart motivation

---

# Quran Module

Features

- Arabic Text
- Multiple Translations
- Tafsir
- Audio
- Offline Download
- Search
- Bookmarks
- Reading Progress
- Memorization Mode

AI Features

- Explain verses
- Simplify meanings
- Child-friendly explanation
- Quiz generation
- Verse summaries
- Ask questions about Quran

---

# Daily Dua

Categories

- Morning
- Evening
- Before Sleep
- After Prayer
- Travel
- Food
- Health
- Protection
- Forgiveness

AI Features

- Recommend duas based on situation
- Personalized reminders

---

# Tasbeeh

Features

- Digital Counter
- Goal Tracking
- Daily History
- Vibrations
- Sound Feedback

AI Features

- Personalized Dhikr plans

---

# Islamic Calendar

Features

- Hijri Calendar
- Gregorian Calendar
- Islamic Holidays
- Moon Phase
- Ramadan
- Eid Countdown
- Ashura
- Mawlid
- Laylat al-Qadr

AI Features

- Explain significance
- Reminder suggestions

---

# Ramadan Mode

Automatically activates during Ramadan.

Features

- Sehri Countdown
- Iftar Countdown
- Prayer Schedule
- Quran Goal
- Daily Dua
- Charity Goal
- Water Tracker
- Meal Planner
- Taraweeh Tracker

AI Features

- Personalized Ramadan Planner
- Daily motivational summaries
- Quran completion planner
- Healthy meal suggestions

---

# Mosque Locator

Uses Google Maps

Features

- Nearby Mosques
- Friday Prayer Times
- Parking
- Reviews
- Directions
- Wheelchair Access

AI Features

- Best mosque recommendation
- Smart routing
- Crowd prediction (future)

---

# Zakat Calculator

Supports

- Cash
- Gold
- Silver
- Investments
- Business
- Property
- Liabilities

Features

- Reports
- Export PDF

AI Features

- Explain calculations
- Charity recommendations

---

# Prayer Tracker

Features

- Calendar
- Statistics
- Heat Map
- Monthly Reports
- Prayer Streaks

AI Features

- Habit analysis
- Personalized improvement plans

---

# Learning

## Daily Learning

- Hadith
- Quran Verse
- Islamic Stories
- Scholar Lectures
- Arabic Vocabulary
- Quizzes
- Progress Tracking
- Certificates

AI Features

- Personalized learning
- Quiz generation
- Daily summaries
- Adaptive lessons

---

# Kids Mode

Features

- Islamic Stories
- Prayer Learning
- Arabic Alphabet
- Quran Memorization
- Games
- Rewards
- Certificates

AI Features

- Child-friendly explanations
- Voice interactions
- Personalized lessons

---

# Family Accounts

Features

- Family Dashboard
- Prayer Progress
- Kids Progress
- Shared Quran Goals
- Ramadan Competition

AI Features

- Weekly family reports
- Goal suggestions

---

# Community

Features

- Mosque Announcements
- Islamic Events
- Volunteer Opportunities
- Charity Campaigns

Future

- Community Discussions
- Study Groups

---

# Global Prayer Dashboard

Displays

- Live Prayer Status
- Current Prayer Worldwide
- Next Prayer Countdown
- World Prayer Map
- Mosque Density
- Hijri Calendar
- Moon Sighting
- Islamic Events

AI Features

- Travel prayer adjustments
- Personalized dashboard

---

# Profile

Features

- Achievements
- Certificates
- Downloads
- Settings
- Languages
- Themes

---

# Settings

Options

- Dark Mode
- Prayer Calculation Method
- Madhhab
- Language
- Notification Settings
- Audio Quality
- Offline Downloads

---

# AI Assistant

Chat Interface

Examples

"What does this verse mean?"

"What breaks fasting?"

"What is the ruling on travel prayer?"

"What dua should I read?"

Capabilities

- Quran Search
- Hadith Search
- Dua Search
- Islamic Calendar Questions
- Zakat Help
- Ramadan Help

Future

- Voice Chat
- Image Recognition
- OCR

---

# AI Search

Semantic Search Across

- Quran
- Tafsir
- Hadith
- Duas
- Articles
- Lectures

---

# AI Recommendations

Recommend

- Surahs
- Lectures
- Daily Goals
- Quizzes
- Dhikr
- Quran Reading Plans

---

# AI OCR

Scan

- Prayer Timetable
- Arabic Text
- Islamic Books

Extract

- Text
- Translation
- Search

---

# AI Voice Assistant

Examples

"Read Surah Yaseen"

"Next Prayer"

"Nearest Mosque"

"Open Today's Hadith"

---

# Admin Panel

Features

Dashboard

Manage

- Users
- Scholars
- Lectures
- Events
- Notifications
- Certificates
- Articles
- Quizzes

Analytics

Content Moderation

---

# Theme & Design System

## Dark / Light Mode support with NativeWind

To provide a consistent, high-fidelity experience, the application uses **NativeWind (Tailwind CSS)** for styling and layout, offering system-level theme synchronization and dark mode.

### Theme Colors Mapping

The color palette below defines the design tokens utilized throughout the mobile interface (via tailwind config) and the backend (for styling email templates, PDF exports, and admin reports):

| Token Name | Light Mode Hex | Dark Mode Hex | Tailwind Class Example | Description |
|---|---|---|---|---|
| **brand** | `#059669` | `#10B981` | `bg-brand dark:bg-brand-dark` | Primary app identity (Emerald green) |
| **bg** | `#ffffff` | `#000000` | `bg-bg-light dark:bg-bg-dark` | Screen base background |
| **el** | `#F0F0F3` | `#212225` | `bg-el-light dark:bg-el-dark` | Element/Card backgrounds |
| **sel** | `#E0E1E6` | `#2E3135` | `bg-sel-light dark:bg-sel-dark` | Selected item states |
| **txt** | `#000000` | `#ffffff` | `text-txt-light dark:text-txt-dark` | Primary body text |
| **txt-sec** | `#60646C` | `#B0B4BA` | `text-txt-sec-light dark:text-txt-sec-dark` | Secondary description text |

### Component Styling Pattern

All components should use NativeWind class names with utility classes mapping light/dark mode elements:
- Containers: `bg-bg-light dark:bg-bg-dark`
- Text: `text-txt-light dark:text-txt-dark`
- Elements/Cards: `bg-el-light dark:bg-el-dark`
- Buttons: `bg-brand-dark dark:bg-brand`

---

# Backend Architecture

Client

↓

React Native

↓

REST API

↓

Express

↓

Controllers

↓

Services

↓

Prisma

↓

PostgreSQL

---

# Suggested Folder Structure

## Mobile

src/

    app/

    components/

    features/

        prayer/

        quran/

        dua/

        learn/

        mosque/

        zakat/

        dashboard/

        profile/

    services/

    hooks/

    store/

    utils/

    assets/

    locales/

---

## Backend

src/

    controllers/

    routes/

    middleware/

    services/

    prisma/

    jobs/

    notifications/

    utils/

---

# Database Models

- User
- Family
- PrayerLog
- QuranBookmark
- QuranProgress
- TasbeehHistory
- DuaFavorite
- QuizResult
- Lecture
- Certificate
- Mosque
- Event
- Donation
- Notification
- ZakatReport
- RamadanProgress
- AIConversation

---

# Third-Party Services

| Purpose | Service |
|----------|----------|
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Authentication | Clerk / Firebase |
| Maps | Google Maps |
| Quran | Quran.com API |
| Prayer Times | AlAdhan API |
| Hadith | Sunnah API |
| Storage | Supabase Storage |
| Push Notifications | Expo |
| Analytics | Firebase Analytics |
| Crash Reporting | Sentry |
| AI | OpenAI / Gemini / Anthropic |
| Email | Resend |
| Monitoring | Better Stack |

---

# Premium Features

- Family Accounts
- Prayer Analytics
- Offline Quran
- Unlimited Downloads
- AI Assistant
- AI Learning Plans
- AI Quran Tutor
- Advanced Statistics
- Exclusive Lectures
- Cloud Sync
- Multiple Devices
- Premium Themes

---

# Monetization

Free

- Prayer Times
- Quran
- Hadith
- Duas
- Tasbeeh
- Islamic Calendar
- Qibla
- Mosque Locator

Premium

- AI Features
- Offline Mode
- Family Dashboard
- Prayer Analytics
- Advanced Learning
- Cloud Backup
- Premium Audio

Optional

- Donations
- Sponsored Islamic Events
- Verified Charity Partnerships

---

# Future Roadmap

## Phase 1 (MVP)

- Authentication
- Prayer Times
- Qibla
- Quran
- Hadith
- Duas
- Tasbeeh
- Islamic Calendar
- Prayer Tracker

---

## Phase 2

- Learning
- Kids Mode
- Mosque Locator
- Ramadan Mode
- Zakat Calculator
- Notifications

---

## Phase 3

- Family Accounts
- Community
- Global Prayer Dashboard
- Certificates
- Admin Panel

---

## Phase 4

- AI Assistant
- AI Quran Tutor
- AI Voice Assistant
- AI OCR
- AI Search
- AI Recommendations
- AI Learning Paths

---

## Phase 5

- Hajj & Umrah Companion
- Halal Restaurant Finder
- Islamic Marketplace
- Charity Platform
- Local Mosque Management
- Smart Wearable Integration