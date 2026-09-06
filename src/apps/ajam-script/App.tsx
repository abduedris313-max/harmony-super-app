import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  auth, 
  fetchManuscripts, 
  ensureUserProfile, 
  toggleSaveManuscript 
} from './lib/firebase';
import { Manuscript, UserProfile } from './types';
import { IOSLayout, ActiveTab } from './components/IOSLayout';
import { ArchiveView } from './views/ArchiveView';
import { AIScannerView } from './views/AIScannerView';
import { TranscriberView } from './views/TranscriberView';
import { PrimerView } from './views/PrimerView';
import { ContributeView } from './views/ContributeView';
import { ProfileView } from './views/ProfileView';
import { ManuscriptDetailModal } from './components/ManuscriptDetailModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('archive');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // PWA Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').then(
        reg => console.log('PWA ServiceWorker registered:', reg.scope),
        err => console.warn('ServiceWorker registration failed:', err)
      );
    }
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await ensureUserProfile(user);
        setUserProfile(profile);
        setSavedIds(profile.savedManuscriptIds || []);
      } else {
        setUserProfile(null);
        setSavedIds([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Manuscripts
  useEffect(() => {
    fetchManuscripts().then(setManuscripts);
  }, []);

  const handleSavedToggle = async (manuscriptId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const updated = await toggleSaveManuscript(currentUser.uid, manuscriptId);
    setSavedIds(updated);
  };

  return (
    <IOSLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentUser={currentUser}
      userProfile={userProfile}
      onOpenAuthModal={() => setIsAuthModalOpen(true)}
    >
      {/* Tab 1: Manuscript Archive Catalog */}
      {activeTab === 'archive' && (
        <ArchiveView
          manuscripts={manuscripts}
          savedIds={savedIds}
          onSelectManuscript={setSelectedManuscript}
          onSavedToggle={handleSavedToggle}
        />
      )}

      {/* Tab 2: AI OCR Manuscript Scanner */}
      {activeTab === 'scanner' && (
        <AIScannerView />
      )}

      {/* Tab 3: Interactive Ajam Transcriber & Keyboard */}
      {activeTab === 'transcribe' && (
        <TranscriberView />
      )}

      {/* Tab 4: Script Primer & Lessons */}
      {activeTab === 'primer' && (
        <PrimerView />
      )}

      {/* Tab 5: Contribute Manuscript & Record Vocal Chant */}
      {activeTab === 'contribute' && (
        <ContributeView
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Tab 6: User Profile & Saved Items */}
      {activeTab === 'profile' && (
        <ProfileView
          currentUser={currentUser}
          userProfile={userProfile}
          allManuscripts={manuscripts}
          savedIds={savedIds}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={() => auth.signOut()}
          onSelectManuscript={setSelectedManuscript}
        />
      )}

      {/* Manuscript Detail Modal */}
      {selectedManuscript && (
        <ManuscriptDetailModal
          manuscript={selectedManuscript}
          currentUser={currentUser}
          savedIds={savedIds}
          onClose={() => setSelectedManuscript(null)}
          onSavedToggle={handleSavedToggle}
        />
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      )}
    </IOSLayout>
  );
}
