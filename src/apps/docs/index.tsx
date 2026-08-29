import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { DocSidebar } from './components/DocSidebar';
import { DocEditor } from './components/DocEditor';
import { DocItem } from './types';

const DEFAULT_DOCS: DocItem[] = [
  {
    id: 'doc-1',
    title: '🌐 Harmony OS Technical Specification & Standards',
    content: `# Harmony OS Technical Specification

## Overview
Harmony OS brings a seamless Apple iOS 18 Springboard aesthetic to full-stack web applications.

### Architectural Pillars:
1. **Modular Mini-Apps**: Each mini-app resides in a clean sub-system module.
2. **Dual Execution Engine**: Supports Native Cloud components alongside GitHub Pages deployments.
3. **PWA Mobile First**: Fully offline capable with Service Worker caching and home screen install prompts.

---

### Security & Data Model:
All user notes, documents, typewriter drafts, and music playlists automatically synchronize with Firestore collections protected by Firebase security rules.`,
    wordCount: 78,
    readingTime: 1,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: 'doc-2',
    title: '📘 Developer Quickstart Guide',
    content: `# Developer Quickstart Guide

To add a new mini-app to the Harmony Super App platform:
1. Create a dedicated module directory under \`/src/apps/your-app/\`.
2. Define core data interfaces in \`types.ts\`.
3. Register the app metadata in \`/src/config/apps.ts\`.
4. Import and bind the module in \`AppRunner.tsx\`.`,
    wordCount: 42,
    readingTime: 1,
    updatedAt: Date.now() - 7200000,
    createdAt: Date.now() - 7200000,
  },
];

export const HarmonyDocsAppModule: React.FC = () => {
  const [docsList, setDocsList] = useState<DocItem[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from Firebase Firestore with fallback to LocalStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const docsRef = collection(db, 'docs');
      unsubscribe = onSnapshot(
        docsRef,
        (snapshot) => {
          const loaded: DocItem[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as DocItem);
          });
          if (loaded.length > 0) {
            loaded.sort((a, b) => b.updatedAt - a.updatedAt);
            setDocsList(loaded);
            if (!activeDocId) setActiveDocId(loaded[0].id);
          } else {
            setDocsList(DEFAULT_DOCS);
            setActiveDocId(DEFAULT_DOCS[0].id);
          }
        },
        () => {
          const local = localStorage.getItem('harmony_docs_data');
          if (local) {
            const parsed = JSON.parse(local);
            setDocsList(parsed);
            if (parsed.length > 0 && !activeDocId) setActiveDocId(parsed[0].id);
          } else {
            setDocsList(DEFAULT_DOCS);
            setActiveDocId(DEFAULT_DOCS[0].id);
          }
        }
      );
    } catch {
      setDocsList(DEFAULT_DOCS);
      setActiveDocId(DEFAULT_DOCS[0].id);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleUpdateActiveDoc = async (updatedFields: Partial<DocItem>) => {
    if (!activeDocId) return;

    const updatedList = docsList.map((docItem) => {
      if (docItem.id === activeDocId) {
        const text = updatedFields.content !== undefined ? updatedFields.content : docItem.content;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const readTime = Math.max(1, Math.ceil(words / 200));

        return {
          ...docItem,
          ...updatedFields,
          wordCount: words,
          readingTime: readTime,
          updatedAt: Date.now(),
        };
      }
      return docItem;
    });

    setDocsList(updatedList);
    localStorage.setItem('harmony_docs_data', JSON.stringify(updatedList));

    const updatedDoc = updatedList.find((d) => d.id === activeDocId);
    if (updatedDoc) {
      try {
        await setDoc(doc(db, 'docs', activeDocId), updatedDoc);
      } catch {
        // Handled via local storage
      }
    }
  };

  const handleCreateDoc = async () => {
    const newDocItem: DocItem = {
      id: `doc-${Date.now()}`,
      title: 'Untitled Document',
      content: '',
      wordCount: 0,
      readingTime: 0,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };

    const nextList = [newDocItem, ...docsList];
    setDocsList(nextList);
    setActiveDocId(newDocItem.id);
    localStorage.setItem('harmony_docs_data', JSON.stringify(nextList));

    try {
      await setDoc(doc(db, 'docs', newDocItem.id), newDocItem);
    } catch {
      // Local fallback
    }
  };

  const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = docsList.filter((d) => d.id !== id);
    setDocsList(filtered);
    if (activeDocId === id) {
      setActiveDocId(filtered.length > 0 ? filtered[0].id : null);
    }
    localStorage.setItem('harmony_docs_data', JSON.stringify(filtered));

    try {
      await deleteDoc(doc(db, 'docs', id));
    } catch {
      // Local fallback
    }
  };

  const filteredDocs = docsList.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = docsList.find((d) => d.id === activeDocId) || null;

  return (
    <div id="harmony-docs-container" className="flex-1 w-full flex flex-col md:flex-row bg-[#0d1117] text-[#c9d1d9] min-h-0 overflow-y-auto md:overflow-hidden">
      <DocSidebar
        docs={filteredDocs}
        activeDocId={activeDocId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectDoc={(d) => setActiveDocId(d.id)}
        onCreateDoc={handleCreateDoc}
        onDeleteDoc={handleDeleteDoc}
      />
      <DocEditor
        docItem={activeDoc}
        onUpdateDoc={handleUpdateActiveDoc}
      />
    </div>
  );
};

export default HarmonyDocsAppModule;
