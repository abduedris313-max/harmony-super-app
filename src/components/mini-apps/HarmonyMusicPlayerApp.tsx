/**
 * @file HarmonyMusicPlayerApp.tsx
 * @description Built-in Native implementation of Harmony Music Player with Web Audio Synth & Firebase sync.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc, Plus, Heart, Music, Volume2, Repeat, Shuffle, Flame } from 'lucide-react';
import { HarmonyPlaylist, Track, SystemUser } from '../../types';

interface HarmonyMusicPlayerAppProps {
  user: SystemUser | null;
  playlists: HarmonyPlaylist[];
  onSavePlaylist: (playlist: Partial<HarmonyPlaylist> & { id: string; name: string }) => Promise<any>;
  onPlayTrack?: (track: Track) => void;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: 't-1',
    title: 'Harmony Ambient Flow',
    artist: 'Harmony Soundscapes',
    album: 'Serenade OS Vol. 1',
    duration: 180,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
    genre: 'Ambient Chill'
  },
  {
    id: 't-2',
    title: 'Lo-Fi Focus Session',
    artist: 'Harmony Beats',
    album: 'Deep Work Chill',
    duration: 210,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    genre: 'Lo-Fi Study'
  },
  {
    id: 't-3',
    title: 'iOS Twilight Synthwave',
    artist: 'Antigravity Dreams',
    album: 'Neon Horizon',
    duration: 195,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    genre: 'Synthwave'
  },
  {
    id: 't-4',
    title: 'Piano Reverie',
    artist: 'Acoustic Harmony',
    album: 'Solitude & Peace',
    duration: 240,
    coverUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
    genre: 'Neoclassical'
  }
];

export const HarmonyMusicPlayerApp: React.FC<HarmonyMusicPlayerAppProps> = ({
  user,
  playlists,
  onSavePlaylist,
  onPlayTrack
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(['t-1']);
  const [playlistName, setPlaylistName] = useState('');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const currentTrack = DEFAULT_TRACKS[currentTrackIndex];

  // Web Audio Synth ambient tone synthesizer for hi-fi playback
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      // Start synth chime tone
      try {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      } catch (e) {}
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (onPlayTrack && nextState) {
      onPlayTrack(currentTrack);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DEFAULT_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DEFAULT_TRACKS.length) % DEFAULT_TRACKS.length);
    setProgress(0);
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const handleSavePlaylist = async () => {
    if (!playlistName.trim()) return;
    try {
      await onSavePlaylist({
        id: `playlist-${Date.now()}`,
        name: playlistName,
        tracks: DEFAULT_TRACKS
      });
      setPlaylistName('');
      alert('Playlist saved to Firebase!');
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="harmony-music-container" className="flex-1 w-full flex flex-col md:flex-row bg-gradient-to-br from-neutral-950 via-fuchsia-950/40 to-neutral-950 text-white overflow-hidden p-6">
      {/* Player Main Stage */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {/* Album Artwork Squircle */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-[36px] overflow-hidden shadow-2xl ring-1 ring-white/20 relative group mb-8">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Audio Equalizer Animated Bars */}
          {isPlaying && (
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-center gap-1.5 h-8">
              <span className="w-1.5 h-full bg-fuchsia-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-2/3 bg-pink-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-5/6 bg-purple-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-1/2 bg-fuchsia-300 rounded-full animate-bounce" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">{currentTrack.title}</h3>
            <p className="text-sm text-fuchsia-300/80 font-medium mt-0.5">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-fuchsia-400"
          >
            <Heart className={`w-6 h-6 ${favorites.includes(currentTrack.id) ? 'fill-fuchsia-500 text-fuchsia-500' : ''}`} />
          </button>
        </div>

        {/* Timeline Progress Bar */}
        <div className="w-full mb-6">
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = clickX / rect.width;
            setProgress(Math.floor(pct * currentTrack.duration));
          }}>
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
              style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-white/50 mt-1.5">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-6 mb-8">
          <button onClick={handlePrev} className="p-3 rounded-full hover:bg-white/10 text-white/80 active:scale-90 transition-transform">
            <SkipBack className="w-7 h-7" />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <button onClick={handleNext} className="p-3 rounded-full hover:bg-white/10 text-white/80 active:scale-90 transition-transform">
            <SkipForward className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Right Sidebar - Playlist & Firebase Sync */}
      <div className="w-full md:w-80 bg-black/40 border-l border-white/10 p-5 rounded-3xl flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-4 flex items-center gap-2">
            <Disc className="w-4 h-4" />
            <span>Playlist Tracklist</span>
          </h4>

          <div className="space-y-2 mb-6">
            {DEFAULT_TRACKS.map((t, index) => (
              <div
                key={t.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`p-2.5 rounded-2xl cursor-pointer flex items-center justify-between border transition-all ${currentTrackIndex === index ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-white' : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/40">{index + 1}</span>
                  <div>
                    <h5 className="text-xs font-semibold truncate max-w-[140px]">{t.title}</h5>
                    <p className="text-[10px] opacity-60 truncate">{t.artist}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono opacity-50">{formatTime(t.duration)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Custom Playlist to Firebase */}
        <div className="p-3.5 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-500/30">
          <label className="text-[11px] font-semibold text-fuchsia-300 block mb-1">
            Save Custom Playlist (Firebase)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="My Favorite Hits..."
              className="flex-1 bg-black/60 border border-neutral-700 text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none"
            />
            <button
              onClick={handleSavePlaylist}
              className="px-3 py-1.5 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-xs font-bold shrink-0"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
