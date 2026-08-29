/**
 * Harmony Writing - Core Type Definitions
 */

export type WritingTheme = 'dark' | 'sepia' | 'emerald' | 'midnight';

export interface WritingDraft {
  id: string;
  title: string;
  content: string;
  targetWords: number;
  wordCount: number;
  charCount: number;
  theme: WritingTheme;
  typewriterSound: boolean;
  updatedAt: number;
  createdAt: number;
}
