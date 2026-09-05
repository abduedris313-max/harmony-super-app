import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { DraftSidebar } from './components/DraftSidebar';
import { TypewriterCanvas } from './components/TypewriterCanvas';
import { WritingDraft, WritingTheme } from './types';
import { useTheme } from '../../hooks/useTheme';

const DEFAULT_DRAFTS: WritingDraft[] = [];

const THEME_STYLES: Record<WritingTheme, string> = {
  dark: 'bg-neutral-50 dark:bg-[#0d1117] text-neutral-900 dark:text-[#c9d1d9]',
  sepia: 'bg-[#fef3c7] dark:bg-[#1c1917] text-[#78350f] dark:text-[#f5f5f4]',
  emerald: 'bg-[#ecfdf5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#ecfdf5]',
  midnight: 'bg-[#f0f9ff] dark:bg-[#0f172a] text-[#0c4a6e] dark:text-[#f8fafc]',
};

export const HarmonyWritingAppModule: React.FC = () => {
  const theme = useTheme();
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
            setDrafts([]);
            setActiveDraftId(null);
          }
        },
        () => {
          const local = localStorage.getItem('harmony_writing_data');
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setDrafts(parsed);
                if (!activeDraftId) setActiveDraftId(parsed[0].id);
                return;
              }
            } catch {
              // fallback
            }
          }
          setDrafts([]);
          setActiveDraftId(null);
        }
      );
    } catch {
      setDrafts([]);
      setActiveDraftId(null);
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
