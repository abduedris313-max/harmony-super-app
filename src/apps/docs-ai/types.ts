/**
 * Harmony Docs AI - Core Type Definitions
 */

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface AiPresetPrompt {
  id: string;
  title: string;
  promptText: string;
  category: 'summarize' | 'grammar' | 'expand' | 'action-items';
}
