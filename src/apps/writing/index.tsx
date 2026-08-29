import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { DraftSidebar } from './components/DraftSidebar';
import { TypewriterCanvas } from './components/TypewriterCanvas';
import { WritingDraft, WritingTheme } from './types';

const DEFAULT_DRAFTS: WritingDraft[] = [
  {
    id: 'draft-1',
    title: '📖 The Art of Modular Systems & Clean Code',
    content: `Chapter 1: The Foundations of Architecture

True craftsmanship in software engineering is defined by restraint, structure, and intent. When building a multi-application ecosystem, every module must remain self-contained, decoupled, and focused on its singular domain.

Notice how the mechanical typewriter sounds feedback with every stroke on your keyboard. Set a word goal above to measure your creative progress.`,
    targetWords: 500,
    wordCount: 61,
    charCount: 382,
    theme: 'dark',
    typewriterSound: true,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
];

const THEME_STYLES: Record<WritingTheme, string> = {
  dark: 'bg-[#0d1117] text-[#c9d1d9]',
  sepia: 'bg-[#1c1917] text-[#f5f5f4]',
  emerald: 'bg-[#064e3b] text-[#ecfdf5]',
  midnight: 'bg-[#0f172a] text-[#f8fafc]',
};

export const HarmonyWritingAppModule: React.FC = () => {
  const [drafts, setDrafts] = useState<WritingDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with Firestore & LocalStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const draftsRef = collection(db, 'typewriter_drafts');
      unsubscribe = onSnapshot(
        draftsRef,
        (snapshot) => {
          const loaded: WritingDraft[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as WritingDraft);
          });
          if (loaded.length > 0) {
            loaded.sort((a, b) => b.updatedAt - a.updatedAt);
            setDrafts(loaded);
            if (!activeDraftId) setActiveDraftId(loaded[0].id);
          } else {
            setDrafts(DEFAULT_DRAFTS);
            setActiveDraftId(DEFAULT_DRAFTS[0].id);
          }
        },
        () => {
          const local = localStorage.getItem('harmony_writing_data');
          if (local) {
            const parsed = JSON.parse(local);
            setDrafts(parsed);
            if (parsed.length > 0 && !activeDraftId) setActiveDraftId(parsed[0].id);
          } else {
            setDrafts(DEFAULT_DRAFTS);
            setActiveDraftId(DEFAULT_DRAFTS[0].id);
          }
        }
      );
    } catch {
      setDrafts(DEFAULT_DRAFTS);
      setActiveDraftId(DEFAULT_DRAFTS[0].id);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleUpdateActiveDraft = async (updatedFields: Partial<WritingDraft>) => {
    if (!activeDraftId) return;

    const updatedList = drafts.map((draft) => {
      if (draft.id === activeDraftId) {
        return {
          ...draft,
          ...updatedFields,
          updatedAt: Date.now(),
        };
      }
      return draft;
    });

    setDrafts(updatedList);
    localStorage.setItem('harmony_writing_data', JSON.stringify(updatedList));

    const updatedDraft = updatedList.find((d) => d.id === activeDraftId);
    if (updatedDraft) {
      try {
        await setDoc(doc(db, 'typewriter_drafts', activeDraftId), updatedDraft);
      } catch {
        // Fallback handled
      }
    }
  };

  const handleCreateDraft = async () => {
    const newDraft: WritingDraft = {
      id: `draft-${Date.now()}`,
      title: 'Untitled Draft',
      content: '',
      targetWords: 500,
      wordCount: 0,
      charCount: 0,
      theme: 'dark',
      typewriterSound: true,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };

    const nextList = [newDraft, ...drafts];
    setDrafts(nextList);
    setActiveDraftId(newDraft.id);
    localStorage.setItem('harmony_writing_data', JSON.stringify(nextList));

    try {
      await setDoc(doc(db, 'typewriter_drafts', newDraft.id), newDraft);
    } catch {
      // Local fallback
    }
  };

  const handleDeleteDraft = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = drafts.filter((d) => d.id !== id);
    setDrafts(filtered);
    if (activeDraftId === id) {
      setActiveDraftId(filtered.length > 0 ? filtered[0].id : null);
    }
    localStorage.setItem('harmony_writing_data', JSON.stringify(filtered));

    try {
      await deleteDoc(doc(db, 'typewriter_drafts', id));
    } catch {
      // Local fallback
    }
  };

  const filteredDrafts = drafts.filter(
    (dr) =>
      dr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dr.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDraft = drafts.find((d) => d.id === activeDraftId) || null;
  const currentTheme = activeDraft ? activeDraft.theme : 'dark';

  return (
    <div
      id="harmony-writing-container"
      className={`flex-1 w-full flex flex-col md:flex-row ${THEME_STYLES[currentTheme]} min-h-0 overflow-y-auto md:overflow-hidden transition-colors duration-300`}
    >
      <DraftSidebar
        drafts={filteredDrafts}
        activeDraftId={activeDraftId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectDraft={(dr) => setActiveDraftId(dr.id)}
        onCreateDraft={handleCreateDraft}
        onDeleteDraft={handleDeleteDraft}
      />
      <TypewriterCanvas
        draft={activeDraft}
        onUpdateDraft={handleUpdateActiveDraft}
      />
    </div>
  );
};

export default HarmonyWritingAppModule;
