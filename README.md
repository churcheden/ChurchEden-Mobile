# ChurchEden Mobile (Expo SDK 54)

Production-ready mobile application for **ChurchEden**, built with **Expo SDK 54**, **React Native 0.81.0**, **React 19**, **TypeScript**, and **Expo Router**.

Designed with enterprise architecture, locked SDK 54 compatibility, multi-environment support, custom font preloading, native iOS/Android permissions, and automated EAS build & submission pipelines.

---

## Technical Stack & SDK Pinning

| Layer | Dependency / Technology | Version Constraint |
| :--- | :--- | :--- |
| **Framework** | Expo SDK | `~54.0.0` (Strictly pinned) |
| **Core Library** | React Native | `0.81.0` |
| **UI Paradigm** | React | `19.0.0` |
| **Navigation** | Expo Router | `~4.0.0` (File-based tab routing) |
| **Icons** | Lucide React Native | `^0.469.0` |
| **Language** | TypeScript | `^5.4.0` |
| **Build & Deploy**| EAS Build & Submit | Profiles: `development`, `preview`, `production` |

---

## Project Structure

```
ChurchEden-Mobile/
├── .env.development         # Development environment configuration
├── .env.staging             # Staging/QA environment configuration
├── .env.production          # Production environment configuration
├── .env.example             # Environment variables template
├── app.config.js            # Dynamic Expo config (Permissions, bundle ID, plugins)
├── eas.json                 # EAS build profiles and App Store/Play Store submit pipeline
├── package.json             # Pinned SDK 54 dependency definitions
├── tsconfig.json            # Expo SDK 54 TypeScript setup with path aliases (@/*)
├── app/                     # Expo Router file-based screens
│   ├── _layout.tsx          # Root Stack layout & asset preloader
│   ├── modal.tsx            # Information modal dialog route
│   ├── +not-found.tsx       # 404 Route handler
│   └── (tabs)/              # Core Feature Tabs
│       ├── _layout.tsx      # Bottom Tab Navigator with brand icons
│       ├── index.tsx        # Overview / Dashboard (Metrics & Quick Actions)
│       ├── members.tsx      # Members Directory (Search & Role Filtering)
│       ├── attendance.tsx   # Attendance & QR Code Scanner Interface
│       ├── donations.tsx    # Online Giving (Tithes, Offerings & Payment Gateways)
│       ├── events.tsx       # Church Events & RSVP Management
│       ├── groups.tsx       # Small Groups & Ministry Directories
│       └── settings.tsx     # Settings, Diagnostics & Environment Details
└── src/                     # Shared Business Logic & Architecture
    ├── assets/              # Branding images and custom fonts (Inter-*)
    ├── components/          # Reusable UI Components (Header, Card, Button, Badge)
    ├── constants/           # Design system tokens (Colors.ts) and Config.ts reader
    ├── hooks/               # Custom React Hooks (useAuth, useLoadedAssets)
    ├── services/            # API Services (api, attendance, payment integrations)
    └── types/               # Domain TypeScript interfaces (Member, Donation, Event)
```

---

## Environment Setup

ChurchEden Mobile supports 3 distinct environments:

1. **Development (`.env.development`)**: Connects to `dev-api.churcheden.app/v1`, Bundle ID `com.churcheden.app.dev`.
2. **Staging (`.env.staging`)**: Connects to `staging-api.churcheden.app/v1`, Bundle ID `com.churcheden.app.staging`.
3. **Production (`.env.production`)**: Connects to `api.churcheden.app/v1`, Bundle ID `com.churcheden.app`.

### Environment Variables Template (`.env.example`)
```env
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_URL=https://dev-api.churcheden.app/v1
EXPO_PUBLIC_BUNDLE_ID=com.churcheden.app
EXPO_PUBLIC_PACKAGE_NAME=com.churcheden.app

# Public Payment Gateway Keys
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxx
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXXXXXXXXXXX
EXPO_PUBLIC_MOMO_PRIMARY_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# Feature Flags
EXPO_PUBLIC_ENABLE_QR_SCANNER=true
EXPO_PUBLIC_ENABLE_LIVE_STREAM=true

# Google OAuth
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
```

---

## Local Development Setup

### 1. Install Dependencies
Ensure Node.js 18+ is installed:
```bash
npm install
```

### 2. Type Verification
Run TypeScript validation to confirm zero type errors:
```bash
npm run check-types
```

### 3. Start Metro Bundler
```bash
# Start standard local development server
npx expo start

# Start development server in Tunnel Mode (Accessible from any network)
npm run start:tunnel
# or
npx expo start --tunnel
```

---

## Expo Tunnel Mode (`--tunnel`) with Ngrok

Expo's tunnel mode allows you to scan the QR code and test the app on physical mobile devices across different Wi-Fi networks or cellular data.

### Setting up `NGROK_AUTHTOKEN` locally
To avoid hardcoding personal credentials into source control:

1. Obtain your personal ngrok authentication token from [dashboard.ngrok.com](https://dashboard.ngrok.com/).
2. Add your token to your local gitignored `.env.development` file:
   ```env
   NGROK_AUTHTOKEN=your_personal_ngrok_auth_token
   ```
3. Alternatively, register your token globally via the ngrok CLI:
   ```bash
   npx ngrok config add-authtoken your_personal_ngrok_auth_token
   ```
4. Run `npm run start:tunnel` or `npx expo start --tunnel`. The CLI will authenticate with ngrok and output a public `exp://...` URL and QR code.

---


## Native iOS & Android Configurations

### iOS Bundle Identifier & Permissions (`app.config.js`)
- **Bundle ID**: `com.churcheden.app`
- **Camera Usage (`NSCameraUsageDescription`)**: Required for scanning member QR codes for service attendance.
- **Photo Library (`NSPhotoLibraryUsageDescription`)**: Required for uploading profile pictures and event media.
- **Microphone Usage (`NSMicrophoneUsageDescription`)**: Required for live service audio streaming.

### Android Package Name & Permissions (`app.config.js`)
- **Package Name**: `com.churcheden.app`
- **Permissions**: `CAMERA`, `VIBRATE`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `INTERNET`.

---

## EAS Build & Submission Instructions

### 1. EAS Login & Initialization
```bash
npm install -g eas-cli
eas login
eas init
```

### 2. Build for Development / Internal Preview
```bash
# iOS Simulator or Internal Distribution
eas build --profile development --platform ios

# Android APK for Internal Testing
eas build --profile preview --platform android
```

### 3. Build for Production Release
```bash
# Production iOS & Android builds
eas build --profile production --platform all
```

### 4. Submit to App Store & Google Play
```bash
# Submit signed iOS App Store build
eas submit --platform ios --profile production

# Submit signed Android App Bundle (.aab) to Google Play Store
eas submit --platform android --profile production
```

---

## License & Support
Internal Proprietary Software for **ChurchEden**. All rights reserved.
