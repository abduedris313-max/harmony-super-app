import React from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  Bookmark, 
  ShieldCheck, 
  Award, 
  Heart, 
  Sparkles, 
  LogIn 
} from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile, Manuscript } from '../types';

interface ProfileViewProps {
  currentUser: User | null;
  userProfile: UserProfile | null;
  allManuscripts: Manuscript[];
  savedIds: string[];
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onSelectManuscript: (m: Manuscript) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userProfile,
  allManuscripts,
  savedIds,
  onOpenAuthModal,
  onLogout,
  onSelectManuscript
}) => {
  const savedManuscripts = allManuscripts.filter(m => savedIds.includes(m.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Scholar Profile & Saved Repository
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Manage your saved Ajam manuscripts, bookmarked chants, and community contributions.
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        {currentUser ? (
          <>
            <div className="flex items-center gap-4 text-center sm:text-left">
              <img
                src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                alt={currentUser.displayName || 'Scholar'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-bold text-lg text-slate-100">
                    {currentUser.displayName || 'Guest Scholar'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1">
                    <Award className="w-3 h-3" /> Ajam Preserver
                  </span>
                </div>
                <p className="text-xs text-slate-400">{currentUser.email || 'Anonymous Guest'}</p>
                <p className="text-xs text-amber-300/80 font-medium">{userProfile?.bio || 'Preserving Ethiopian Sufi Ajam tradition.'}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="w-full text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">You are currently in Guest Mode</h3>
              <p className="text-xs text-slate-400">Sign in with Google to synchronize your saved manuscripts across all your iOS and desktop devices.</p>
            </div>
            <button
              onClick={onOpenAuthModal}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 inline-flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In with Firebase
            </button>
          </div>
        )}
      </div>

      {/* Saved Manuscripts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" /> Saved Manuscripts ({savedManuscripts.length})
          </h3>
        </div>

        {savedManuscripts.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-2 border border-slate-800">
            <p className="text-xs text-slate-400">No saved manuscripts yet. Click the bookmark icon on any manuscript to save it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedManuscripts.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectManuscript(item)}
                className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-center gap-3"
              >
                <img src={item.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                <div className="space-y-1 flex-1">
                  <h4 className="font-ajam font-bold text-base text-amber-300" dir="rtl">{item.titleAjam}</h4>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">{item.titleEnglish}</p>
                  <p className="text-[10px] text-slate-400">{item.region} • {item.language}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
