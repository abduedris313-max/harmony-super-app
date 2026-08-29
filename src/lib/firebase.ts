/**
 * @file firebase.ts
 * @description Firebase SDK initialization (Auth & Firestore) for Harmony OS Super App.
 * Handles authentication, real-time listeners, and cloud synchronization across all mini apps.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  Firestore 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { HarmonyNote, HarmonyDoc, HarmonyWritingDraft, HarmonyPlaylist, HarmonyAiChat } from '../types';

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// -----------------------------------------------------------------------------
// AUTHENTICATION HELPERS
// -----------------------------------------------------------------------------

export async function loginAnonymously() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.warn('[Firebase Auth Warning] Anonymous sign in fallback to offline user:', error);
    return null;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function registerWithEmail(email: string, pass: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// -----------------------------------------------------------------------------
// HARMONY NOTES FIRESTORE CRUD
// -----------------------------------------------------------------------------

const NOTES_COLLECTION = 'harmony_notes';

export async function saveHarmonyNote(userId: string, note: Partial<HarmonyNote> & { id: string; title: string }) {
  const noteRef = doc(db, NOTES_COLLECTION, note.id);
  const data: HarmonyNote = {
    id: note.id,
    userId,
    title: note.title,
    content: note.content || '',
    category: note.category || 'Personal',
    tags: note.tags || [],
    pinned: note.pinned || false,
    updatedAt: new Date().toISOString(),
    createdAt: note.createdAt || new Date().toISOString()
  };
  await setDoc(noteRef, data, { merge: true });
  return data;
}

export async function deleteHarmonyNote(noteId: string) {
  await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
}

export function subscribeHarmonyNotes(userId: string, callback: (notes: HarmonyNote[]) => void) {
  const q = query(
    collection(db, NOTES_COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const notes: HarmonyNote[] = [];
    snapshot.forEach((docSnap) => {
      notes.push(docSnap.data() as HarmonyNote);
    });
    // sort locally by updatedAt desc
    notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    callback(notes);
  }, (err) => {
    console.warn('[Firestore Notes Listener Warning]', err);
  });
}

// -----------------------------------------------------------------------------
// HARMONY DOCS FIRESTORE CRUD
// -----------------------------------------------------------------------------

const DOCS_COLLECTION = 'harmony_docs';

export async function saveHarmonyDoc(userId: string, document: Partial<HarmonyDoc> & { id: string; title: string }) {
  const docRef = doc(db, DOCS_COLLECTION, document.id);
  const words = (document.content || '').trim().split(/\s+/).filter(Boolean).length;
  const data: HarmonyDoc = {
    id: document.id,
    userId,
    title: document.title,
    content: document.content || '',
    wordCount: words,
    readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    category: document.category || 'General',
    updatedAt: new Date().toISOString(),
    createdAt: document.createdAt || new Date().toISOString()
  };
  await setDoc(docRef, data, { merge: true });
  return data;
}

export async function deleteHarmonyDoc(docId: string) {
  await deleteDoc(doc(db, DOCS_COLLECTION, docId));
}

export function subscribeHarmonyDocs(userId: string, callback: (docs: HarmonyDoc[]) => void) {
  const q = query(
    collection(db, DOCS_COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const docs: HarmonyDoc[] = [];
    snapshot.forEach((docSnap) => {
      docs.push(docSnap.data() as HarmonyDoc);
    });
    docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    callback(docs);
  }, (err) => {
    console.warn('[Firestore Docs Listener Warning]', err);
  });
}

// -----------------------------------------------------------------------------
// HARMONY WRITING FIRESTORE CRUD
// -----------------------------------------------------------------------------

const WRITING_COLLECTION = 'harmony_writing';

export async function saveHarmonyDraft(userId: string, draft: Partial<HarmonyWritingDraft> & { id: string; title: string }) {
  const draftRef = doc(db, WRITING_COLLECTION, draft.id);
  const words = (draft.content || '').trim().split(/\s+/).filter(Boolean).length;
  const data: HarmonyWritingDraft = {
    id: draft.id,
    userId,
    title: draft.title,
    content: draft.content || '',
    targetWordCount: draft.targetWordCount || 500,
    currentWordCount: words,
    typewriterSound: draft.typewriterSound !== undefined ? draft.typewriterSound : true,
    theme: draft.theme || 'twilight',
    updatedAt: new Date().toISOString(),
    createdAt: draft.createdAt || new Date().toISOString()
  };
  await setDoc(draftRef, data, { merge: true });
  return data;
}

export async function deleteHarmonyDraft(draftId: string) {
  await deleteDoc(doc(db, WRITING_COLLECTION, draftId));
}

export function subscribeHarmonyDrafts(userId: string, callback: (drafts: HarmonyWritingDraft[]) => void) {
  const q = query(
    collection(db, WRITING_COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const drafts: HarmonyWritingDraft[] = [];
    snapshot.forEach((docSnap) => {
      drafts.push(docSnap.data() as HarmonyWritingDraft);
    });
    drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    callback(drafts);
  }, (err) => {
    console.warn('[Firestore Drafts Listener Warning]', err);
  });
}

// -----------------------------------------------------------------------------
// HARMONY MUSIC FIRESTORE CRUD
// -----------------------------------------------------------------------------

const MUSIC_COLLECTION = 'harmony_music';

export async function saveHarmonyPlaylist(userId: string, playlist: Partial<HarmonyPlaylist> & { id: string; name: string }) {
  const ref = doc(db, MUSIC_COLLECTION, playlist.id);
  const data: HarmonyPlaylist = {
    id: playlist.id,
    userId,
    name: playlist.name,
    tracks: playlist.tracks || [],
    updatedAt: new Date().toISOString()
  };
  await setDoc(ref, data, { merge: true });
  return data;
}

export function subscribeHarmonyPlaylists(userId: string, callback: (playlists: HarmonyPlaylist[]) => void) {
  const q = query(
    collection(db, MUSIC_COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const playlists: HarmonyPlaylist[] = [];
    snapshot.forEach((docSnap) => {
      playlists.push(docSnap.data() as HarmonyPlaylist);
    });
    callback(playlists);
  }, (err) => {
    console.warn('[Firestore Music Listener Warning]', err);
  });
}

// -----------------------------------------------------------------------------
// HARMONY DOCS AI FIRESTORE CRUD
// -----------------------------------------------------------------------------

const AI_CHATS_COLLECTION = 'harmony_ai_chats';

export async function saveHarmonyAiChat(userId: string, chat: Partial<HarmonyAiChat> & { id: string }) {
  const ref = doc(db, AI_CHATS_COLLECTION, chat.id);
  const data: HarmonyAiChat = {
    id: chat.id,
    userId,
    docTitle: chat.docTitle || 'Untitled Document Query',
    messages: chat.messages || [],
    updatedAt: new Date().toISOString()
  };
  await setDoc(ref, data, { merge: true });
  return data;
}

export function subscribeHarmonyAiChats(userId: string, callback: (chats: HarmonyAiChat[]) => void) {
  const q = query(
    collection(db, AI_CHATS_COLLECTION),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snapshot) => {
    const chats: HarmonyAiChat[] = [];
    snapshot.forEach((docSnap) => {
      chats.push(docSnap.data() as HarmonyAiChat);
    });
    chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    callback(chats);
  }, (err) => {
    console.warn('[Firestore AI Chats Listener Warning]', err);
  });
}
