import React from 'react';
import { 
  BookOpen, 
  ScanLine, 
  Keyboard, 
  GraduationCap, 
  Bookmark, 
  PlusCircle, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  Search,
  ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';

export type ActiveTab = 'archive' | 'scanner' | 'transcribe' | 'contribute' | 'primer' | 'profile';

interface IOSLayoutProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  userProfile: UserProfile | null;
  onOpenAuthModal: () => void;
  children: React.ReactNode;
}

export const IOSLayout: React.FC<IOSLayoutProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  userProfile,
  onOpenAuthModal,
  children
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* iOS Translucent Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 pt-safe px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & App Name */}
          <div 
            onClick={() => setActiveTab('archive')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-600 p-[1.5px] shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="font-ajam font-bold text-amber-400 text-xl leading-none">ع</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-base tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors">
                  Harmony Ajam Script
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Sufi Archive
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Ethiopian Sufi Manuscript Digitization & Preservation
              </p>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-2xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'archive' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Manuscript Archive
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'scanner' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              AI Manuscript OCR
            </button>

            <button
              onClick={() => setActiveTab('transcribe')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'transcribe' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Ajam Transcriber
            </button>

            <button
              onClick={() => setActiveTab('primer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'primer' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Script Primer
            </button>

            <button
              onClick={() => setActiveTab('contribute')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'contribute' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Contribute
            </button>
          </nav>

          {/* User Auth Profile Button */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/80 transition-colors"
              >
                <img 
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`} 
                  alt={currentUser.displayName || 'Scholar'} 
                  className="w-7 h-7 rounded-xl object-cover border border-amber-500/30"
                />
                <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate hidden sm:inline">
                  {currentUser.displayName || 'Scholar'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 hover:opacity-90 active:scale-95 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28 md:pb-12">
        {children}
      </main>

      {/* iOS Touch-Friendly Mobile Bottom Navigation Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800/80 px-2 pt-2 pb-safe shadow-2xl">
        <div className="flex items-center justify-around">
          
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all ${
              activeTab === 'archive' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Archive</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all relative ${
              activeTab === 'scanner' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ScanLine className="w-5 h-5 mb-1" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </div>
            <span className="text-[10px]">AI OCR</span>
          </button>

          <button
            onClick={() => setActiveTab('transcribe')}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all ${
              activeTab === 'transcribe' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Transcribe</span>
          </button>

          <button
            onClick={() => setActiveTab('primer')}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all ${
              activeTab === 'primer' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Primer</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all ${
              activeTab === 'profile' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Account</span>
          </button>

        </div>
      </nav>

    </div>
  );
};
