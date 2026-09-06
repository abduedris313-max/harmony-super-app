# 📘 Harmony OS Mini App Developer Guide & SDK Specification

Welcome to the **Harmony OS Super App Developer Ecosystem**. This guide provides complete documentation, architecture specifications, API references, and best practices for building, testing, and publishing sandboxed mini applications.

---

## 📑 Table of Contents

1. [Architecture & Philosophy](#1-architecture--philosophy)
2. [Mini App Manifest Specification (`app-manifest.json`)](#2-mini-app-manifest-specification)
3. [Harmony Mini App SDK Reference](#3-harmony-mini-app-sdk-reference)
   - [Initialization & Handshake](#initialization--handshake)
   - [Tactile Haptic Feedback (`ui.triggerHaptic`)](#tactile-haptic-feedback)
   - [Toast Notifications & Window Controls (`ui.showToast`, `ui.close`)](#toast-notifications--window-controls)
   - [Dynamic Theme Synchronization (`theme.onChange`)](#dynamic-theme-synchronization)
   - [Scoped Persistent Storage (`storage`)](#scoped-persistent-storage)
   - [Cross-App Navigation (`navigation.openApp`)](#cross-app-navigation)
   - [System Clipboard (`clipboard.writeText`)](#system-clipboard)
4. [Apple iOS Human Interface Guidelines (HIG)](#4-apple-ios-human-interface-guidelines)
5. [Security, Permissions & Sandboxing Policy](#5-security-permissions--sandboxing-policy)
6. [Step-by-Step Publishing Workflow](#6-step-by-step-publishing-workflow)
7. [Official Starter Templates](#7-official-starter-templates)

---

## 1. Architecture & Philosophy

Harmony OS uses a **Micro-Frontend Container Architecture** combining native shell controls with sandboxed web runtimes:

```
┌─────────────────────────────────────────────────────────────┐
│                 Harmony OS Super App Shell                  │
│  (Status Bar, Spring Navigation, Control Center, Dock)       │
├─────────────────────────────────────────────────────────────┤
│                    Host Bridge Layer                        │
│   - postMessage RPC Dispatcher                              │
│   - Persistent Firestore / LocalStorage Vault               │
│   - iOS Taptic Engine Vibration Controller                  │
├─────────────────────────────────────────────────────────────┤
│               Sandboxed Mini App Container                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Third-Party Mini App (Vanilla / React / Vue / Svelte)│  │
│  │   - Loads Universal `harmony-sdk.js` or typed SDK     │  │
│  │   - Respects iOS HIG & Dark/Light mode synchronization│  │
│  │   - Uses scoped key-value persistent storage          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

Mini applications run with high isolation while enjoying native-feeling hardware capabilities (haptics, theme tracking, notifications, cross-app workflows).

---

## 2. Mini App Manifest Specification

Every mini app must include an `app-manifest.json` describing its identity, visual styling, permissions, and deployment endpoints.

```json
{
  "$schema": "https://harmony.os/schemas/mini-app-manifest.v1.json",
  "id": "com.company.myapp",
  "name": "Quick Tasks",
  "version": "1.2.0",
  "tagline": "Frictionless task tracking and lists",
  "description": "Capture quick thoughts, manage checklists, and organize daily productivity.",
  "category": "productivity",
  "icon": "check-circle",
  "color": "from-emerald-500 to-teal-600",
  "author": "Acme Software Corp",
  "deployedUrl": "https://company.github.io/quick-tasks/",
  "repoUrl": "https://github.com/company/quick-tasks",
  "status": "published",
  "badge": "Productivity",
  "rating": 4.9,
  "reviewsCount": 120,
  "downloads": 4800,
  "packageSize": "64 KB",
  "permissions": [
    "storage",
    "haptics",
    "clipboard",
    "notifications"
  ],
  "supportedOrientations": ["portrait", "landscape"],
  "minPlatformVersion": "2.0.0"
}
```

### Field Definitions

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Unique package identifier (e.g. `com.dev.app` or `harmony-finance`). |
| `name` | `string` | **Yes** | Display name shown in App Store, Home Screen, and Spotlight. |
| `version` | `string` | **Yes** | Semantic version (`MAJOR.MINOR.PATCH`). |
| `tagline` | `string` | **Yes** | 1-line subtitle shown in App Store lists. |
| `description` | `string` | **Yes** | Comprehensive app description for the App Store details page. |
| `category` | `enum` | **Yes** | `productivity`, `utilities`, `developer`, `finance`, `ai`, `audio`, `health`. |
| `icon` | `string` | **Yes** | Lucide icon identifier (e.g. `zap`, `check-circle`, `sparkles`, `bot`). |
| `color` | `string` | **Yes** | Tailwind gradient classes (e.g. `from-blue-500 to-indigo-600`). |
| `deployedUrl` | `string` | **Yes** | HTTPS URL serving the mini app. |
| `repoUrl` | `string` | No | Source code repository (e.g. GitHub). |
| `permissions` | `string[]`| No | Requested capabilities: `storage`, `haptics`, `clipboard`, `notifications`. |

---

## 3. Harmony Mini App SDK Reference

### Installation

#### Option A: Vanilla Web / CDN `<script>`
Include the Universal SDK directly in your HTML `<head>` or `<body>`:
```html
<script src="https://harmony.os/harmony-sdk.js"></script>
<!-- Or bundle locally: /harmony-sdk.js -->
```

#### Option B: React / TypeScript / Vite Projects
Copy `/templates/react-mini-app/harmony-sdk.ts` directly into your `src/` directory.

---

### API Reference

#### Initialization & Handshake
```typescript
import Harmony from './harmony-sdk';

const context = await Harmony.init();
console.log('App ID:', context.appId);
console.log('Dark Mode:', context.isDarkMode);
console.log('User:', context.user);
```

#### Tactile Haptic Feedback
Triggers tactile vibrations matching the Apple iOS Taptic Engine:
```typescript
// Supported types: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error'
Harmony.ui.triggerHaptic('light');     // Tap / button press
Harmony.ui.triggerHaptic('medium');    // Action completed
Harmony.ui.triggerHaptic('heavy');     // Delete / destructive item
Harmony.ui.triggerHaptic('success');   // Affirmative pulse sequence
```

#### Toast Notifications & Window Controls
```typescript
// Display a system toast banner in the Harmony Shell
Harmony.ui.showToast({
  title: 'Note Saved',
  message: 'Synced to your personal cloud vault.',
  type: 'success' // 'info' | 'success' | 'warning' | 'error'
});

// Update the active window title in the status bar
Harmony.ui.setTitle('Document - Untitled');

// Request host to close the mini app and return to Home Screen
Harmony.ui.close();
```

#### Dynamic Theme Synchronization
Immediately adapts when the user toggles Dark Mode or switches Control Center themes:
```typescript
// 1. Synchronous check
const isDark = Harmony.theme.isDark();

// 2. Event listener for live toggles
const unsubscribe = Harmony.theme.onChange((isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// Clean up when unmounting (e.g. in React useEffect)
unsubscribe();
```

#### Scoped Persistent Storage
Persistent key-value storage isolated to your mini app's unique namespace:
```typescript
// Save any JSON-serializable object
await Harmony.storage.setItem('user_settings', {
  fontSize: 16,
  autoSave: true,
  lastOpened: Date.now()
});

// Retrieve item
const settings = await Harmony.storage.getItem('user_settings');

// Remove item
await Harmony.storage.removeItem('user_settings');
```

#### Cross-App Navigation
Open other apps within the Harmony OS Super App:
```typescript
// Open Notes Mini App with pre-filled context
Harmony.navigation.openApp('harmony-notes', {
  action: 'create_note',
  title: 'Exported from Quick Tasks'
});

// Open external URL in a safe new window
Harmony.navigation.openExternal('https://github.com');
```

#### System Clipboard
```typescript
await Harmony.clipboard.writeText('Hello from Harmony Mini App!');
```

---

## 4. Apple iOS Human Interface Guidelines

To ensure all mini apps look and feel native to Harmony OS:

1. **Touch Target Dimensions**: Every clickable button, icon, or row must measure at least **44 × 44 pt** (`min-height: 44px; min-width: 44px;`).
2. **Safe Area Inset Padding**: Always account for the notch and the iOS home gesture indicator bar:
   ```css
   padding-top: env(safe-area-inset-top, 16px);
   padding-bottom: env(safe-area-inset-bottom, 20px);
   ```
3. **Corner Radii Hierarchy**:
   - Cards / Containers: `16px` to `20px` (or `rounded-2xl`).
   - Buttons / Inputs: `12px` to `14px` (or `rounded-xl`).
   - Inner child corners must mathematically follow `OuterRadius - Padding`.
4. **Haptic Feedback Semantics**: Provide light feedback on taps, medium on submissions, and heavy on deletions. Avoid spamming vibrations.
5. **Dark Mode Contrast**: Never use pitch black `#000` text on dark backgrounds. Ensure WCAG AA compliance (4.5:1 minimum ratio).

---

## 5. Security, Permissions & Sandboxing Policy

Mini apps are executed inside sandboxed containers with strict attribute constraints:

```html
<iframe
  src="https://your-app.com"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  allow="camera; microphone; geolocation; autoplay; clipboard-write; encrypted-media"
/>
```

- **Storage Isolation**: Local storage keys are automatically namespaced with `harmony_app_${appId}_*`.
- **Permission Declarations**: Mini apps must explicitly declare required capabilities (`storage`, `haptics`, `clipboard`, `notifications`) in `app-manifest.json`.

---

## 6. Step-by-Step Publishing Workflow

1. **Clone or Copy a Template**:
   Choose from `/templates/vanilla-mini-app/` or `/templates/react-mini-app/`.
2. **Develop & Test**:
   Build your features using the Harmony SDK APIs.
3. **Deploy to HTTPS**:
   Deploy to GitHub Pages, Firebase Hosting, Cloudflare Pages, or Vercel.
4. **Test in the Interactive Sandbox**:
   - Open the **App Store Developer Console** at `/admin.html`
   - Navigate to **Test Sandbox**
   - Enter your deployed URL or select your starter template
   - Test in iPhone 16 Pro, iPad Air, and Desktop viewports with live haptics and theme triggers.
5. **Submit to Central Repository**:
   - Navigate to **Publish Studio**
   - Fill in package details or import your `app-manifest.json`
   - Click **Submit & Publish**
   - Your mini app is immediately live in the Harmony App Store!

---

## 7. Official Starter Templates

The repository includes three production-ready starter templates located in `/templates/`:

1. **Vanilla Mini App Starter** (`/templates/vanilla-mini-app/`):
   - Pure HTML5, CSS3, ES6 with zero build steps or dependencies.
   - Ideal for single-file utilities, calculators, and quick tools.
2. **React + TypeScript Starter** (`/templates/react-mini-app/`):
   - React 18, TypeScript, Tailwind CSS, Lucide CDN, and typed SDK bridge.
   - Ideal for full-featured multi-screen mini apps.
3. **AI Utility Starter** (`/templates/ai-tool-mini-app/`):
   - Prompt engineering cards, transformation modes, token estimation, and clipboard copy.
   - Ideal for AI chat, summarizers, and prompt assistants.

---
*Harmony OS Super App — Senior Full-Stack Engineering Specification*
