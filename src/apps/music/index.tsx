import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { PlayerStage } from './components/PlayerStage';
import { PlaylistQueue } from './components/PlaylistQueue';
import { TrackItem } from './types';
import { ambientMusicSynth } from './utils/audioSynth';
import { useTheme } from '../../hooks/useTheme';

export const SOLFEGGIO_PRESETS: TrackItem[] = [
  {
    id: 'solfeggio-432',
    title: '432 Hz • Natural Harmonic Resonance',
    artist: 'Solfeggio Pure Frequency',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    duration: 300,
    audioFreq: 432,
  },
  {
    id: 'solfeggio-528',
    title: '528 Hz • Transformation & Clarity',
    artist: 'Solfeggio Pure Frequency',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    duration: 300,
    audioFreq: 528,
  },
  {
    id: 'solfeggio-639',
    title: '639 Hz • Harmonic Connection',
    artist: 'Solfeggio Pure Frequency',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    duration: 300,
    audioFreq: 639,
  },
  {
    id: 'solfeggio-741',
    title: '741 Hz • Awakening & Deep Focus',
    artist: 'Solfeggio Pure Frequency',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: 300,
    audioFreq: 741,
  },
  {
    id: 'solfeggio-852',
    title: '852 Hz • Inner Awareness & Balance',
    artist: 'Solfeggio Pure Frequency',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    duration: 300,
    audioFreq: 852,
  },
  {
    id: 'solfeggio-963',
    title: '963 Hz • Pure Consciousness & Serenity',
    artist: 'Solfeggio Pure Frequency',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    duration: 300,
    audioFreq: 963,
  },
];

export const HarmonyMusicPlayerAppModule: React.FC = () => {
  const theme = useTheme();
  const [tracks, setTracks] = useState<TrackItem[]>(() => {
    const saved = localStorage.getItem('harmony_music_tracks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback to solfeggio presets
      }
    }
    return SOLFEGGIO_PRESETS;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const currentTrack = tracks[currentTrackIndex] || SOLFEGGIO_PRESETS[0];

  // Playback timer & Web Audio Synth trigger
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      // Play real synthesized solfeggio tone for ambient sound
      ambientMusicSynth.playTone(currentTrack.audioFreq);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      ambientMusicSynth.stop();
    }

    return () => {
      clearInterval(timer);
      ambientMusicSynth.stop();
    };
  }, [isPlaying, currentTrackIndex, tracks]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleSeek = (seconds: number) => {
    setProgress(seconds);
  };

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSavePlaylist = async (playlistName: string) => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'playlists'), {
        name: playlistName,
        tracks,
        createdAt: Date.now(),
      });
      setFeedbackMsg(`Playlist "${playlistName}" saved to Firestore.`);
    } catch {
      const saved = localStorage.getItem('harmony_playlists_data');
      const list = saved ? JSON.parse(saved) : [];
      list.push({ name: playlistName, tracks, createdAt: Date.now() });
      localStorage.setItem('harmony_playlists_data', JSON.stringify(list));
      setFeedbackMsg(`Playlist "${playlistName}" saved locally.`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleAddCustomTrack = (title: string, freq: number) => {
    const newTrack: TrackItem = {
      id: `tone-${Date.now()}`,
      title: title || `${freq} Hz Custom Tone`,
      artist: 'Custom Synthesizer Tone',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      duration: 300,
      audioFreq: freq,
    };
    const updated = [...tracks, newTrack];
    setTracks(updated);
    localStorage.setItem('harmony_music_tracks', JSON.stringify(updated));
    setFeedbackMsg(`Added ${freq} Hz frequency channel.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div
      id="harmony-music-container"
      className="relative flex-1 w-full flex flex-col md:flex-row bg-neutral-50 dark:bg-gradient-to-br dark:from-[#0d1117] dark:via-fuchsia-950/30 dark:to-[#0d1117] text-neutral-900 dark:text-[#c9d1d9] min-h-0 overflow-y-auto p-4 sm:p-6 gap-6"
    >
      {feedbackMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-fuchsia-600 text-white text-xs font-semibold shadow-lg shadow-fuchsia-500/20 animate-fade-in">
          {feedbackMsg}
        </div>
      )}
      <PlayerStage
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        favorites={favorites}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onToggleFavorite={handleToggleFavorite}
      />
      <PlaylistQueue
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={(idx) => {
          setCurrentTrackIndex(idx);
          setProgress(0);
          setIsPlaying(true);
        }}
        onSavePlaylist={handleSavePlaylist}
        onAddCustomTrack={handleAddCustomTrack}
        isSaving={isSaving}
      />
    </div>
  );
};

export default HarmonyMusicPlayerAppModule;
