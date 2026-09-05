import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, Music2, Disc } from 'lucide-react';
import { TrackItem } from '../types';

interface PlayerStageProps {
  currentTrack: TrackItem;
  isPlaying: boolean;
  progress: number;
  favorites: string[];
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onToggleFavorite: (id: string) => void;
}

export const PlayerStage: React.FC<PlayerStageProps> = ({
  currentTrack,
  isPlaying,
  progress,
  favorites,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onToggleFavorite,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const isFav = favorites.includes(currentTrack.id);

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full min-h-0 shrink-0">
      {/* Album Cover Squircle */}
      <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/20 relative group mb-6 bg-gradient-to-br from-fuchsia-600 to-indigo-700 dark:from-fuchsia-900 dark:to-indigo-900">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isPlaying ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Animated Vinyl Overlay when Playing */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`p-4 rounded-full bg-black/60 text-fuchsia-400 backdrop-blur-md ${isPlaying ? 'animate-spin' : ''}`}>
            <Disc className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Track Title & Favorite Button */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">{currentTrack.title}</h3>
          <p className="text-xs sm:text-sm text-fuchsia-600 dark:text-fuchsia-300/80 font-medium mt-0.5">{currentTrack.artist}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(currentTrack.id)}
          className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-400 dark:text-white/70 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 transition-all active:scale-90"
        >
          <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFav ? 'fill-fuchsia-500 text-fuchsia-500' : ''}`} />
        </button>
      </div>

      {/* Scrub Bar */}
      <div className="w-full mb-4">
        <div
          className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            onSeek(percentage * currentTrack.duration);
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-200"
            style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-neutral-500 dark:text-[#8b949e] mt-1.5">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-6 mb-4">
        <button
          onClick={onPrev}
          className="p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-white/80 active:scale-90 transition-transform"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={onTogglePlay}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform shadow-fuchsia-500/25"
        >
          {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </button>
        <button
          onClick={onNext}
          className="p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-white/80 active:scale-90 transition-transform"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
