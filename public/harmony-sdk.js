/**
 * @file harmony-sdk.js
 * @version 1.0.0
 * @description Harmony OS Mini App Universal JavaScript SDK.
 * Provides bidirectional postMessage bridge communication between sandboxed mini apps
 * and the Harmony OS Host Shell (Haptics, Storage, Themes, UI Toasts, Navigation).
 * Works with Vanilla JS, React, Vue, Svelte, or plain HTML.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Harmony = factory();
    root.HarmonySDK = root.Harmony;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Request ID counter for promise-based RPC calls
  let _requestId = 0;
  const _pendingRequests = new Map();
  const _themeListeners = new Set();
  const _pauseListeners = new Set();
  const _resumeListeners = new Set();

  let _appContext = {
    appId: '',
    appName: '',
    version: '1.0.0',
    isDarkMode: false,
    user: null,
    isReady: false
  };

  /**
   * Helper to send postMessage to host window
   */
  function _postToHost(action, payload, requestId) {
    if (typeof window === 'undefined') return;
    const target = window.parent || window.opener || window;
    const message = {
      type: 'HARMONY_SDK_MESSAGE',
      action: action,
      payload: payload || {},
      requestId: requestId || null,
      timestamp: Date.now()
    };
    target.postMessage(message, '*');
  }

  /**
   * Listen for incoming messages from host shell
   */
  if (typeof window !== 'undefined') {
    window.addEventListener('message', function (event) {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      // Host initialization event
      if (data.type === 'HARMONY_SDK_EVENT' && data.event === 'init') {
        const payload = data.payload || {};
        _appContext = {
          appId: payload.appId || _appContext.appId,
          appName: payload.appName || _appContext.appName,
          version: payload.version || _appContext.version,
          isDarkMode: Boolean(payload.isDarkMode),
          user: payload.user || null,
          isReady: true
        };
        _notifyThemeListeners(_appContext.isDarkMode);
      }

      // Host theme change event
      if (data.type === 'HARMONY_SDK_EVENT' && data.event === 'theme_change') {
        _appContext.isDarkMode = Boolean(data.payload && data.payload.isDarkMode);
        _notifyThemeListeners(_appContext.isDarkMode);
      }

      // Host lifecycle events
      if (data.type === 'HARMONY_SDK_EVENT' && data.event === 'pause') {
        _pauseListeners.forEach(function (cb) { try { cb(); } catch (e) { console.error(e); } });
      }
      if (data.type === 'HARMONY_SDK_EVENT' && data.event === 'resume') {
        _resumeListeners.forEach(function (cb) { try { cb(); } catch (e) { console.error(e); } });
      }

      // Response to promise-based RPC
      if (data.type === 'HARMONY_SDK_RESPONSE' && data.requestId) {
        const resolver = _pendingRequests.get(data.requestId);
        if (resolver) {
          _pendingRequests.delete(data.requestId);
          if (data.error) {
            resolver.reject(new Error(data.error));
          } else {
            resolver.resolve(data.data);
          }
        }
      }
    });
  }

  function _notifyThemeListeners(isDark) {
    _themeListeners.forEach(function (cb) {
      try { cb(isDark); } catch (e) { console.error(e); }
    });
  }

  function _sendRpc(action, payload) {
    return new Promise(function (resolve, reject) {
      const id = 'req_' + (++_requestId) + '_' + Date.now();
      _pendingRequests.set(id, { resolve: resolve, reject: reject });
      _postToHost(action, payload, id);

      // Timeout after 4 seconds
      setTimeout(function () {
        if (_pendingRequests.has(id)) {
          _pendingRequests.delete(id);
          // Fallback to local fallback if host didn't reply in time
          resolve(null);
        }
      }, 4000);
    });
  }

  const Harmony = {
    version: '1.0.0',

    /**
     * Initializes the SDK and handshakes with the Harmony Host Shell.
     * @returns {Promise<Object>} Current app context
     */
    init: function () {
      return new Promise(function (resolve) {
        _postToHost('handshake', { timestamp: Date.now() });
        // Give host 100ms or resolve with current state
        setTimeout(function () {
          resolve(_appContext);
        }, 120);
      });
    },

    /**
     * Context getters
     */
    getContext: function () {
      return Object.assign({}, _appContext);
    },

    /**
     * UI & Haptics API
     */
    ui: {
      /**
       * Triggers tactile vibration matching iOS Taptic feedback.
       * @param {'light'|'medium'|'heavy'|'selection'|'success'|'warning'|'error'} [type='light']
       */
      triggerHaptic: function (type) {
        const hapticType = type || 'light';
        _postToHost('haptic', { type: hapticType });
        // Also trigger navigator.vibrate fallback if available
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(hapticType === 'heavy' ? 30 : hapticType === 'medium' ? 18 : 10);
          } catch (e) {}
        }
      },

      /**
       * Shows a native toast banner in the Harmony Host.
       * @param {Object} options
       * @param {string} options.title
       * @param {string} [options.message]
       * @param {'info'|'success'|'warning'|'error'} [options.type='info']
       */
      showToast: function (options) {
        if (!options || !options.title) return;
        _postToHost('toast', {
          title: options.title,
          message: options.message || '',
          type: options.type || 'info'
        });
      },

      /**
       * Closes the active mini app and returns to Harmony Home Screen.
       */
      close: function () {
        _postToHost('close', {});
      },

      /**
       * Updates the window title in the host status bar.
       * @param {string} title
       */
      setTitle: function (title) {
        _postToHost('set_title', { title: String(title) });
      }
    },

    /**
     * Dynamic Theme Integration
     */
    theme: {
      /**
       * Checks whether the host system is currently in Dark Mode.
       * @returns {boolean}
       */
      isDark: function () {
        return _appContext.isDarkMode;
      },

      /**
       * Subscribes to host system theme changes (Light / Dark mode).
       * @param {Function} callback (isDark: boolean) => void
       * @returns {Function} Unsubscribe function
       */
      onChange: function (callback) {
        if (typeof callback !== 'function') return function () {};
        _themeListeners.add(callback);
        // Call immediately with current state
        try { callback(_appContext.isDarkMode); } catch (e) {}
        return function () {
          _themeListeners.delete(callback);
        };
      }
    },

    /**
     * Persistent Scoped Storage
     * Stores data safely in the host's persistent storage engine,
     * isolated to the current mini app's namespace.
     */
    storage: {
      /**
       * Stores an item.
       * @param {string} key
       * @param {any} value
       * @returns {Promise<boolean>}
       */
      setItem: function (key, value) {
        try {
          localStorage.setItem('harmony_app_' + _appContext.appId + '_' + key, JSON.stringify(value));
        } catch (e) {}
        return _sendRpc('storage_set', { key: key, value: value });
      },

      /**
       * Retrieves an item.
       * @param {string} key
       * @returns {Promise<any>}
       */
      getItem: function (key) {
        try {
          const local = localStorage.getItem('harmony_app_' + _appContext.appId + '_' + key);
          if (local !== null) {
            return Promise.resolve(JSON.parse(local));
          }
        } catch (e) {}
        return _sendRpc('storage_get', { key: key });
      },

      /**
       * Removes an item.
       * @param {string} key
       * @returns {Promise<boolean>}
       */
      removeItem: function (key) {
        try {
          localStorage.removeItem('harmony_app_' + _appContext.appId + '_' + key);
        } catch (e) {}
        return _sendRpc('storage_remove', { key: key });
      }
    },

    /**
     * Cross-App Navigation
     */
    navigation: {
      /**
       * Opens another Harmony Mini App by package ID.
       * @param {string} appId Target app package ID (e.g., 'harmony-notes')
       * @param {Object} [params] Parameters passed to target app
       */
      openApp: function (appId, params) {
        _postToHost('open_app', { appId: appId, params: params || {} });
      },

      /**
       * Requests the host to open an external web URL safely.
       * @param {string} url
       */
      openExternal: function (url) {
        _postToHost('open_external', { url: url });
      }
    },

    /**
     * Clipboard Utilities
     */
    clipboard: {
      /**
       * Writes text to the system clipboard.
       * @param {string} text
       * @returns {Promise<boolean>}
       */
      writeText: function (text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          return navigator.clipboard.writeText(text).then(function () { return true; });
        }
        return _sendRpc('clipboard_write', { text: text });
      }
    },

    /**
     * Lifecycle Hooks
     */
    lifecycle: {
      onPause: function (cb) {
        if (typeof cb === 'function') _pauseListeners.add(cb);
      },
      onResume: function (cb) {
        if (typeof cb === 'function') _resumeListeners.add(cb);
      }
    }
  };

  return Harmony;
});
