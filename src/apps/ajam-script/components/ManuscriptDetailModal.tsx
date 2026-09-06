import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  MapPin, 
  Feather, 
  Send,
  BookOpen,
  Info
} from 'lucide-react';
import { Manuscript, Comment, Verse } from '../types';
import { fetchComments, addComment, toggleLikeManuscript, toggleSaveManuscript } from '../lib/firebase';
import { User } from 'firebase/auth';

interface ManuscriptDetailModalProps {
  manuscript: Manuscript;
  currentUser: User | null;
  savedIds: string[];
  onClose: () => void;
  onSavedToggle: (manuscriptId: string) => void;
}

export const ManuscriptDetailModal: React.FC<ManuscriptDetailModalProps> = ({
  manuscript,
  currentUser,
  savedIds,
  onClose,
  onSavedToggle
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(manuscript.likesCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'context' | 'comments'>('text');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSaved = savedIds.includes(manuscript.id);

  useEffect(() => {
    // Load comments from Firestore
    fetchComments(manuscript.id).then(setComments);
  }, [manuscript.id]);

  // Audio sync handler
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    // Find corresponding verse
    const index = manuscript.verses.findIndex(
      v => v.audioTimestampStart !== undefined && 
           v.audioTimestampEnd !== undefined && 
           time >= v.audioTimestampStart && 
           time <= v.audioTimestampEnd
    );
    if (index !== -1) {
      setActiveVerseIndex(index);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCopyText = () => {
    const textToCopy = manuscript.verses
      .map(v => `${v.lineNum}. ${v.ajamText}\n   (${v.ethiopicText})\n   ${v.englishText}`)
      .join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = async () => {
    const newCount = await toggleLikeManuscript(manuscript.id);
    setLikes(newCount);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentUser) return;
    setIsSubmittingComment(true);
    try {
      const added = await addComment({
        manuscriptId: manuscript.id,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Guest Scholar',
        userPhoto: currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`,
        text: newCommentText.trim()
      });
      setComments([added, ...comments]);
      setNewCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Feather className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-ajam font-bold text-lg sm:text-xl text-amber-300 leading-tight">
                {manuscript.titleAjam}
              </h2>
              <p className="text-xs text-slate-400">
                {manuscript.titleEnglish} • <span className="text-amber-400">{manuscript.language}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSavedToggle(manuscript.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors text-xs font-semibold"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30" />
              <span>{likes}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Segment Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 pt-2 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'text' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Ajam Verses
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'image' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            Manuscript Scan
          </button>

          <button
            onClick={() => setActiveTab('context')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'context' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            History & Meter
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'comments' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Discussion ({comments.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Audio Player Card (if audio available) */}
          {manuscript.audioUrl && (
            <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 bg-slate-800/40 border border-slate-700/50">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="flex-1 w-full space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-amber-400">Vocal Chanting Recitation (Menzuma)</span>
                  <span className="text-slate-400">
                    {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Number(e.target.value);
                    }
                  }}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <audio
                ref={audioRef}
                src={manuscript.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          )}

          {/* Tab 1: Verses List */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Showing {manuscript.verses.length} transcribed lines with synchronized Ge'ez & English
                </p>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Verses' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {manuscript.verses.map((v, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      activeVerseIndex === idx 
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/20">
                        {v.lineNum}
                      </span>
                      
                      {/* Ajam Script Line (RTL) */}
                      <p className="font-ajam text-2xl sm:text-3xl text-amber-300 text-right leading-relaxed font-semibold flex-1" dir="rtl">
                        {v.ajamText}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs border-t border-slate-800/60 pt-2 mt-2">
                      <p className="font-ethiopic text-slate-300 text-right font-medium">
                        {v.ethiopicText}
                      </p>
                      <p className="text-slate-400 italic">
                        "{v.englishText}"
                      </p>
                      {v.notes && (
                        <p className="text-[11px] text-amber-400/80 bg-amber-500/5 p-2 rounded-xl mt-1">
                          💡 <span className="font-medium">Scribal note:</span> {v.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Manuscript High-Res Scan View */}
          {activeTab === 'image' && (
            <div className="space-y-3 text-center">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                <img
                  src={manuscript.imageUrl}
                  alt={manuscript.titleEnglish}
                  className="w-full max-h-[500px] object-contain rounded-xl"
                />
              </div>
              <p className="text-xs text-slate-400">
                High-Resolution Historical Scan • Preserved in {manuscript.region} Archives ({manuscript.era})
              </p>
            </div>
          )}

          {/* Tab 3: Historical Context & Poetic Meter */}
          {activeTab === 'context' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Summary & Purpose
                </h4>
                <p className="text-slate-300 leading-relaxed">{manuscript.summary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Regional Context ({manuscript.region})
                </h4>
                <p className="text-slate-300 leading-relaxed">{manuscript.historicalContext}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Poetic Meter (Bahre)</span>
                  <span className="font-semibold text-slate-200">{manuscript.poeticMeter}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-semibold text-amber-400">{manuscript.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Discussion & Community Comments */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {currentUser ? (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add a scholarly observation or question..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post
                  </button>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 text-center">
                  Please sign in to participate in the manuscript discussion.
                </div>
              )}

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">No discussions posted yet. Be the first to share an observation!</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-800/80 flex items-start gap-3 text-xs">
                      <img src={c.userPhoto} alt={c.userName} className="w-7 h-7 rounded-xl object-cover border border-amber-500/20" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{c.userName}</span>
                          <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
