# Harmony OS React + TypeScript Mini App Template

A production-grade starter template for developing mini applications using **React 18**, **TypeScript**, **Tailwind CSS**, and the **Harmony OS Mini App SDK**.

## 🛠 Features

- **Apple iOS HIG Architecture**: Cupertino rounded styling, glassmorphism, responsive spring transitions, and safe area insets.
- **Typed Harmony SDK**: Full TypeScript types for haptics, theme events, scoped storage, and notifications.
- **Dynamic Dark Mode**: Synchronizes immediately with the Harmony Host Shell theme.
- **Tactile Feedback**: Integrated iOS Taptic Engine vibration simulation.
- **Persistent Storage**: Uses `Harmony.storage` with automatic local cache fallback.

## 📦 Project Structure

```
react-mini-app/
├── app-manifest.json   # Package metadata and permissions
├── harmony-sdk.ts      # Strongly typed Harmony OS Bridge SDK
├── App.tsx             # Main React application component
├── index.html          # HTML entry point with safe-area viewport
├── package.json        # Dependencies (React 18, Vite, Tailwind CSS)
└── README.md           # Developer guide
```

## 🚀 Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

## 🌐 Deployment & Publishing

Deploy the `dist/` directory to any HTTPS static host (e.g. GitHub Pages, Vercel, Firebase Hosting, Netlify), then register your package in the **Harmony App Store Developer Console** (`/admin.html`).
