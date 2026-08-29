# Harmony OS Super App 🚀

An iOS-styled, mobile-first **Super App Ecosystem** that integrates all of `@abduedris313-max`'s Harmony WebApps into a unified mini-app launcher platform powered by Firebase, Gemini AI, and PWA capabilities.

## 📱 Integrated Harmony Mini Apps

All Harmony WebApps are accessible via responsive iOS-style mini app frames and synced native cloud tools:

| Mini App Name | GitHub Pages Deployment | Source Repository | Purpose |
| :--- | :--- | :--- | :--- |
| **harmony-notes** | [abduedris313-max.github.io/harmony-notes](https://abduedris313-max.github.io/harmony-notes/) | [github.com/abduedris313-max/harmony-notes](https://github.com/abduedris313-max/harmony-notes) | Quick capture notes with categories, tagging, & cloud backup |
| **harmony-docs** | [abduedris313-max.github.io/harmony-docs](https://abduedris313-max.github.io/harmony-docs/) | [github.com/abduedris313-max/harmony-docs](https://github.com/abduedris313-max/harmony-docs) | Document editor & rich text workspace |
| **harmony-writing** | [abduedris313-max.github.io/harmony-writing](https://abduedris313-max.github.io/harmony-writing/) | [github.com/abduedris313-max/harmony-writing](https://github.com/abduedris313-max/harmony-writing) | Focus-mode writing studio with daily word targets & typewriter sound FX |
| **harmony-music-player** | [abduedris313-max.github.io/harmony-music-player](https://abduedris313-max.github.io/harmony-music-player/) | [github.com/abduedris313-max/harmony-music-player](https://github.com/abduedris313-max/harmony-music-player) | iOS Music Player with playlists, equalizer, synthesizer & background playback |
| **harmony-docs-ai** | [abduedris313-max.github.io/harmony-docs-ai](https://abduedris313-max.github.io/harmony-docs-ai/) | [github.com/abduedris313-max/harmony-docs-ai](https://github.com/abduedris313-max/harmony-docs-ai) | Gemini AI powered document analysis, chat assistant & smart summaries |

---

## ✨ Features & Architecture

- **iOS 18 Look & Feel**: Glassmorphic top headers, dynamic island notifications, springboard launcher grid, bottom dock, control center slider drawer, spotlight global search, and 3D app switcher card stack.
- **Firebase Authentication & Cloud Storage**:
  - Firebase Auth (Anonymous & Email accounts).
  - Firestore Database persistence for Notes, Docs, Writing Drafts, Music Playlists, and Gemini AI Chat histories.
- **Full-Stack Express + Vite Setup**:
  - Express server (`server.ts`) handles API routes (`/api/harmony/ai`, `/api/harmony/apps`, `/api/health`).
  - Bundled for production using `esbuild` into single CommonJS `dist/server.cjs`.
- **PWA Ready**:
  - `manifest.json` web app specification for mobile installation.
  - Service Worker (`sw.js`) handling static asset caching and offline fallback mode.
- **GitHub Actions Integration**:
  - Pre-configured `.github/workflows/deploy.yml` for automated CI/CD deployment to GitHub Pages.
- **CDN Icons & Assets**:
  - High performance icon assets loaded via Lucide CDN (`https://cdn.jsdelivr.net/...`).

---

## 🛠️ Local Development & Scripts

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
# Install dependencies
npm install

# Run full-stack dev server (Express backend + Vite frontend)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 🔒 Environment Variables (`.env.example`)

```env
GEMINI_API_KEY="Your Gemini API Key"
APP_URL="Hosted app URL"
PORT=3000
```
