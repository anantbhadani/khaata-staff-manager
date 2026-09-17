# Khaata — Staff Attendance & Salary Manager

Khaata is a modern, mobile-first application designed to help households and small businesses manage attendance and salary payments for recurring staff (such as cooks, maids, drivers, laborers, etc.) without relying on notebooks or messaging threads.

This project was built with a local-first, offline-ready architecture tailored for Capacitor and Android.

## Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Custom Design System tokens)
*   **State Management:** Zustand
*   **Database:** Dexie.js (IndexedDB wrapper for offline storage)
*   **Data Visualization:** Recharts
*   **Icons:** Lucide React
*   **Native Shell:** Capacitor (Core & Haptics)

## Core Features

*   **Full Staff Directory:** Add and manage staff with custom pay types and rules.
*   **Daily Attendance:** Sub-second optimized UI for marking attendance.
*   **Advances & Deductions:** Track early payments and penalties.
*   **Auto-Calculated Salaries:** Monthly breakdowns of exactly what is owed.
*   **Offline-First Native Feel:** Powered by local IndexedDB. Includes a polished 60fps CSS launch animation and automatic dark mode support.
*   **Cross-Platform Ready:** Built as a static Next.js PWA, wrapped in Capacitor for Android.

## Architecture Overview

The app is entirely **Local-First**. 
*   `src/lib/db.ts` defines the IndexedDB schema and manages persistent storage locally using Dexie.js. All Primary Keys are strictly UUID strings to ensure conflict-free offline operations and future-proof cloud syncing capabilities.
*   `src/lib/store.ts` binds the Dexie database to an in-memory Zustand reactive state. The UI components directly subscribe to Zustand for blazing fast `< 20ms` interactive responses, while the store asynchronously writes changes to Dexie behind the scenes.
*   The application operates strictly as a Single Page Application (SPA) output utilizing Next.js `output: "export"`. Next.js Dynamic Routes (`[id]`) have been explicitly avoided and replaced with URL query parameters (`?id=uuid`) to guarantee flawless static file serving from Capacitor's native `index.html`.

## Key Features

*   **Sub-second Attendance:** Mark full, half, or absent days with single taps via the Home Dashboard or Calendar views, enhanced by native Haptic feedback.
*   **Dynamic Salary Calculation:** Fully automated tracking of Daily vs. Monthly wages, with support for pro-rata rules, mid-month advances, and bonus/deduction adjustments.
*   **Monthly Payment Cycles:** Clear visual state distinguishing "Paid" vs "Pending" staff payments for a given month.
*   **Visual Reports:** Integrated bar charts breaking down top earners and historical attendance statistics.

## Getting Started

### Prerequisites
*   Node.js (v20+)
*   npm or yarn

### Installation
```bash
npm install
```

### Local Development
To run the web app in your browser for local testing:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Emulate a mobile device layout via Chrome DevTools for the best experience.

### Production Build & Capacitor Sync

1. Build the static Next.js export:
```bash
npm run build
```

2. Copy the web assets to the Android Capacitor project:
```bash
npx cap sync android
```

3. Open Android Studio to build and deploy to your phone:
```bash
npx cap open android
```

*(Note: Capacitor CLI commands would be run from the root after adding Android/iOS platform folders).*
