<div align="center">
  <img src="public/logo.svg" alt="Khaata Logo" width="120" />
  <h1>Khaata — Staff Attendance & Salary Manager</h1>
  <p>A high-performance, offline-first mobile application designed to effortlessly manage daily staff attendance, track cash advances, and automate salary calculations.</p>
</div>

<br />

## 🚨 The Problem
Households and small businesses in emerging markets rely heavily on recurring staff (cooks, maids, drivers, laborers). Managing their attendance, calculating pro-rata salaries, and tracking mid-month cash advances is traditionally done using messy physical notebooks or scattered WhatsApp threads, leading to calculation errors and end-of-month disputes.

## 💡 The Solution
**Khaata** replaces the notebook. It is a blazing-fast, mobile-first app that allows users to mark daily attendance in under a second. It automatically tallies full-days, half-days, and absences, subtracts mid-month cash advances, and generates a precise, itemized salary breakdown at the end of every month.

## 🛠️ Tech Stack & Architecture

This project was engineered from the ground up as a **Local-First PWA** tailored for Android deployment via Capacitor.

*   **Framework:** Next.js 14 (App Router)
*   **State Management:** Zustand (for `< 10ms` reactive UI updates)
*   **Database:** Dexie.js (IndexedDB wrapper for robust offline storage)
*   **Styling:** Tailwind CSS (Custom Design System with dynamic Dark Mode)
*   **Native Shell:** Capacitor (Core & Haptics)
*   **Data Visualization:** Recharts
*   **Language:** TypeScript

### Why Offline-First?
Speed is the ultimate feature. By utilizing `Dexie.js` and strict UUID primary keys, the app never waits for a network request. All data is written to the device's local IndexedDB instantly. Zustand optimistically updates the React UI, ensuring that marking attendance for 10 staff members takes less than 5 seconds combined.

### Static Export Architecture
To ensure seamless compilation into a Capacitor native shell, the application operates strictly as a Single Page Application (SPA). Next.js Dynamic Routes (`/staff/[id]`) were intentionally refactored into URL query parameters (`/staff/detail?id=uuid`) alongside React `<Suspense>` boundaries. This guarantees flawless static file serving (`output: "export"`) from Capacitor's `index.html`.

## ✨ Core Features

*   **Sub-Second Attendance:** Mark full, half, or absent days with single taps via the Home Dashboard or Calendar views, enhanced by native haptic feedback.
*   **Dynamic Salary Engine:** Automated tracking of Daily vs. Monthly wages, with built-in support for pro-rata rules.
*   **Financial Tracking:** Seamlessly log mid-month cash advances, bonuses, and damage deductions.
*   **Monthly Payment Cycles:** Clear visual state distinguishing "Paid" vs "Pending" staff payments for any given month.
*   **Visual Reports:** Integrated bar charts breaking down top earners and historical attendance statistics.
*   **Polished UX:** 60fps CSS-driven launch animations, custom glassmorphism components, and a system-synced dark mode toggle.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v20+)
*   npm or yarn

### Installation & Local Development
```bash
# Clone the repository
git clone https://github.com/anantbhadani/khaata-staff-manager.git
cd khaata-staff-manager

# Install dependencies
npm install

# Run the local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. *Tip: Emulate a mobile device layout via Chrome DevTools for the intended experience.*

### Production Build & Android Deployment

1. Build the static Next.js export:
```bash
npm run build
```

2. Copy the web assets to the Android Capacitor project:
```bash
npx cap sync android
```

3. Open Android Studio to build and deploy the APK to your physical device:
```bash
npx cap open android
```
*(Note: If building on Windows with special characters in your path, use the Gradle wrapper directly from a sanitized directory).*
