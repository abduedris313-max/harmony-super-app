# Harmony OS Vanilla Mini App Starter

A zero-dependency starter template for building high-performance mini apps running in the **Harmony OS Super App** ecosystem.

## 📁 File Structure

```
vanilla-mini-app/
├── app-manifest.json   # Package metadata, permissions, entry points
├── index.html          # Clean HTML5 structure with iOS HIG viewport
├── style.css           # iOS Human Interface Guidelines styling & Dark Mode
├── app.js              # Application logic leveraging Harmony SDK
└── README.md           # Developer documentation
```

## 🚀 Quickstart

1. **Test Locally**:
   Open `index.html` directly in your browser, or host it on any local web server (`npx serve .` or `python3 -m http.server 8080`).

2. **Deploy**:
   Deploy your static directory to GitHub Pages, Cloudflare Pages, Firebase Hosting, or Vercel:
   ```bash
   # Example with gh-pages
   npx gh-pages -d .
   ```

3. **Publish to Harmony Central Repository**:
   - Open the **App Store Developer Console** at `/admin.html`
   - Click **Publish Studio**
   - Provide your `app-manifest.json` values or upload the manifest
   - Enter your deployed HTTPS URL
   - Test in the **Interactive Test Sandbox**

## ⚡ SDK Integration

Include the SDK script:
```html
<script src="/harmony-sdk.js"></script>
```

```javascript
// 1. Initialize
const context = await Harmony.init();

// 2. Listen to Host Theme changes
Harmony.theme.onChange((isDark) => {
  document.body.classList.toggle('dark-mode', isDark);
});

// 3. Tactile Feedback
Harmony.ui.triggerHaptic('success');

// 4. Scoped Persistent Storage
await Harmony.storage.setItem('user_pref', { sound: true });
const pref = await Harmony.storage.getItem('user_pref');

// 5. Host Toasts
Harmony.ui.showToast({ title: 'Saved!', type: 'success' });
```
