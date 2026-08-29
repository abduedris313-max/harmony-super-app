/**
 * Harmony Docs - Core Type Definitions
 */

export interface DocItem {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  readingTime: number;
  updatedAt: number;
  createdAt: number;
}

export interface FormattingOption {
  label: string;
  syntax: string;
  icon: string;
  description: string;
}
