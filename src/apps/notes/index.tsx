import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { NoteSidebar } from './components/NoteSidebar';
import { NoteEditor } from './components/NoteEditor';
import { NoteItem, NoteCategory } from './types';
import { useTheme } from '../../hooks/useTheme';

const DEFAULT_NOTES: NoteItem[] = [];

export const HarmonyNotesAppModule: React.FC = () => {
  const theme = useTheme();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSaving, setIsSaving] = useState(false);

  // Load from Firebase Firestore with fallback to LocalStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const notesRef = collection(db, 'notes');
      unsubscribe = onSnapshot(
        notesRef,
        (snapshot) => {
          const loaded: NoteItem[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as NoteItem);
          });
          if (loaded.length > 0) {
            loaded.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.updatedAt - a.updatedAt);
            setNotes(loaded);
            if (!activeNoteId) setActiveNoteId(loaded[0].id);
          } else {
            setNotes(DEFAULT_NOTES);
            setActiveNoteId(null);
          }
        },
        () => {
          // Fallback to local storage if Firestore permission/network error occurs
          const local = localStorage.getItem('harmony_notes_data');
          if (local) {
            const parsed = JSON.parse(local);
            setNotes(parsed);
            if (parsed.length > 0 && !activeNoteId) setActiveNoteId(parsed[0].id);
          } else {
            setNotes(DEFAULT_NOTES);
            setActiveNoteId(null);
          }
        }
      );
    } catch {
      setNotes(DEFAULT_NOTES);
      setActiveNoteId(null);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save changes to Firebase & LocalStorage
  const handleUpdateActiveNote = async (updatedFields: Partial<NoteItem>) => {
    if (!activeNoteId) return;

    setIsSaving(true);
    const updatedNotes = notes.map((note) => {
      if (note.id === activeNoteId) {
        return { ...note, ...updatedFields, updatedAt: Date.now() };
      }
      return note;
    });

    setNotes(updatedNotes);
    localStorage.setItem('harmony_notes_data', JSON.stringify(updatedNotes));

    const updatedNote = updatedNotes.find((n) => n.id === activeNoteId);
    if (updatedNote) {
      try {
        await setDoc(doc(db, 'notes', activeNoteId), updatedNote);
      } catch {
        // Silently handled by local storage fallback
      }
    }
    setTimeout(() => setIsSaving(false), 300);
  };

  const handleCreateNote = async () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      category: 'Personal',
      tags: [],
      isPinned: false,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };

    const nextNotes = [newNote, ...notes];
    setNotes(nextNotes);
    setActiveNoteId(newNote.id);
    localStorage.setItem('harmony_notes_data', JSON.stringify(nextNotes));

    try {
      await setDoc(doc(db, 'notes', newNote.id), newNote);
    } catch {
      // Handled via local state
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (activeNoteId === id) {
      setActiveNoteId(filtered.length > 0 ? filtered[0].id : null);
    }
    localStorage.setItem('harmony_notes_data', JSON.stringify(filtered));

    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch {
      // Handled via local state
    }
  };

  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, isPinned: !note.isPinned, updatedAt: Date.now() };
      }
      return note;
    });

    updatedNotes.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.updatedAt - a.updatedAt);
    setNotes(updatedNotes);
    localStorage.setItem('harmony_notes_data', JSON.stringify(updatedNotes));

    const updatedNote = updatedNotes.find((n) => n.id === id);
    if (updatedNote) {
      try {
        await setDoc(doc(db, 'notes', id), updatedNote);
      } catch {
        // Handled locally
      }
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  return (
    <div id="harmony-notes-container" className="flex-1 w-full flex flex-col md:flex-row bg-neutral-50 dark:bg-[#0d1117] text-neutral-900 dark:text-[#c9d1d9] min-h-0 overflow-y-auto md:overflow-hidden">
      <NoteSidebar
        notes={filteredNotes}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSelectNote={(note) => setActiveNoteId(note.id)}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        onTogglePin={handleTogglePin}
      />
      <NoteEditor
        note={activeNote}
        onUpdateNote={handleUpdateActiveNote}
        isSaving={isSaving}
      />
    </div>
  );
};

export default HarmonyNotesAppModule;
