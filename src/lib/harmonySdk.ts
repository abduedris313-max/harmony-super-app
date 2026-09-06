/**
 * @file harmonySdk.ts
 * @description Strongly-typed Harmony Mini App TypeScript SDK.
 * Facilitates bidirectional postMessage RPC between sandboxed mini apps and the Harmony OS Host Shell.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'swipe' | 'dismiss' | 'success' | 'warning' | 'error';
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface HarmonyAppContext {
  appId: string;
  appName: string;
  version: string;
  isDarkMode: boolean;
  user: {
    uid: string;
    displayName?: string;
    email?: string;
  } | null;
  isReady: boolean;
}

export interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
}

class HarmonyBridgeClient {
  private requestId = 0;
  private pendingRequests = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private themeListeners = new Set<(isDark: boolean) => void>();
  private pauseListeners = new Set<() => void>();
  private resumeListeners = new Set<() => void>();

  private context: HarmonyAppContext = {
    appId: '',
    appName: '',
    version: '1.0.0',
    isDarkMode: false,
    user: null,
    isReady: false
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleHostMessage.bind(this));
    }
  }

  private handleHostMessage(event: MessageEvent) {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'HARMONY_SDK_EVENT') {
      if (data.event === 'init') {
        const payload = data.payload || {};
        this.context = {
          appId: payload.appId || this.context.appId,
          appName: payload.appName || this.context.appName,
          version: payload.version || this.context.version,
          isDarkMode: Boolean(payload.isDarkMode),
          user: payload.user || null,
          isReady: true
        };
        this.notifyThemeListeners(this.context.isDarkMode);
      } else if (data.event === 'theme_change') {
        this.context.isDarkMode = Boolean(data.payload?.isDarkMode);
        this.notifyThemeListeners(this.context.isDarkMode);
      } else if (data.event === 'pause') {
        this.pauseListeners.forEach(cb => { try { cb(); } catch (e) { console.error(e); } });
      } else if (data.event === 'resume') {
        this.resumeListeners.forEach(cb => { try { cb(); } catch (e) { console.error(e); } });
      }
    }

    if (data.type === 'HARMONY_SDK_RESPONSE' && data.requestId) {
      const resolver = this.pendingRequests.get(data.requestId);
      if (resolver) {
        this.pendingRequests.delete(data.requestId);
        if (data.error) {
          resolver.reject(new Error(data.error));
        } else {
          resolver.resolve(data.data);
        }
      }
    }
  }

  private notifyThemeListeners(isDark: boolean) {
    this.themeListeners.forEach(cb => {
      try { cb(isDark); } catch (e) { console.error(e); }
    });
  }

  private postToHost(action: string, payload?: Record<string, any>, requestId?: string) {
    if (typeof window === 'undefined') return;
    const target = window.parent || window.opener || window;
    target.postMessage({
      type: 'HARMONY_SDK_MESSAGE',
      action,
      payload: payload || {},
      requestId: requestId || null,
      timestamp: Date.now()
    }, '*');
  }

  private sendRpc<T = any>(action: string, payload?: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = `req_${++this.requestId}_${Date.now()}`;
      this.pendingRequests.set(id, { resolve, reject });
      this.postToHost(action, payload, id);

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          resolve(null as any);
        }
      }, 4000);
    });
  }

  public init(): Promise<HarmonyAppContext> {
    return new Promise((resolve) => {
      this.postToHost('handshake', { timestamp: Date.now() });
      setTimeout(() => resolve({ ...this.context }), 120);
    });
  }

  public getContext(): HarmonyAppContext {
    return { ...this.context };
  }

  public readonly ui = {
    triggerHaptic: (type: HapticType = 'light') => {
      this.postToHost('haptic', { type });
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          const duration = type === 'heavy' ? 30 : type === 'medium' ? 18 : 10;
          navigator.vibrate(duration);
        } catch {
          // ignore
        }
      }
    },

    showToast: (options: ToastOptions) => {
      this.postToHost('toast', {
        title: options.title,
        message: options.message || '',
        type: options.type || 'info'
      });
    },

    close: () => {
      this.postToHost('close', {});
    },

    setTitle: (title: string) => {
      this.postToHost('set_title', { title });
    }
  };

  public readonly theme = {
    isDark: (): boolean => {
      return this.context.isDarkMode;
    },
    onChange: (callback: (isDark: boolean) => void): (() => void) => {
      this.themeListeners.add(callback);
      try { callback(this.context.isDarkMode); } catch { /* ignore */ }
      return () => {
        this.themeListeners.delete(callback);
      };
    }
  };

  public readonly storage = {
    setItem: async <T = any>(key: string, value: T): Promise<boolean> => {
      try {
        localStorage.setItem(`harmony_app_${this.context.appId}_${key}`, JSON.stringify(value));
      } catch {
        // ignore
      }
      return this.sendRpc<boolean>('storage_set', { key, value });
    },

    getItem: async <T = any>(key: string): Promise<T | null> => {
      try {
        const local = localStorage.getItem(`harmony_app_${this.context.appId}_${key}`);
        if (local !== null) {
          return JSON.parse(local) as T;
        }
      } catch {
        // ignore
      }
      return this.sendRpc<T>('storage_get', { key });
    },

    removeItem: async (key: string): Promise<boolean> => {
      try {
        localStorage.removeItem(`harmony_app_${this.context.appId}_${key}`);
      } catch {
        // ignore
      }
      return this.sendRpc<boolean>('storage_remove', { key });
    }
  };

  public readonly navigation = {
    openApp: (appId: string, params?: Record<string, any>) => {
      this.postToHost('open_app', { appId, params: params || {} });
    },
    openExternal: (url: string) => {
      this.postToHost('open_external', { url });
    }
  };

  public readonly clipboard = {
    writeText: async (text: string): Promise<boolean> => {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch {
          // fallback
        }
      }
      return this.sendRpc<boolean>('clipboard_write', { text });
    }
  };

  public readonly lifecycle = {
    onPause: (callback: () => void) => {
      this.pauseListeners.add(callback);
    },
    onResume: (callback: () => void) => {
      this.resumeListeners.add(callback);
    }
  };
}

export const Harmony = new HarmonyBridgeClient();
export const HarmonySDK = Harmony;
export default Harmony;
