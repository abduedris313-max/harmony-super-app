/**
 * Harmony Notes - Core Type Definitions
 */

export type NoteCategory = 'Personal' | 'Work' | 'Ideas' | 'Archive';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  isPinned?: boolean;
  updatedAt: number;
  createdAt: number;
}

export interface NotesState {
  notes: NoteItem[];
  activeNoteId: string | null;
  searchQuery: string;
  selectedCategory: string;
}
