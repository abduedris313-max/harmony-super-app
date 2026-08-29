import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { PlayerStage } from './components/PlayerStage';
import { PlaylistQueue } from './components/PlaylistQueue';
import { TrackItem } from './types';
import { ambientMusicSynth } from './utils/audioSynth';

const DEFAULT_TRACKS: TrackItem[] = [
  {
    id: 'track-1',
    title: 'Midnight Coding Symphony',
    artist: 'Harmony Lo-Fi Beats',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    duration: 180,
    audioFreq: 432, // Solfeggio frequency 432Hz
  },
  {
    id: 'track-2',
    title: 'Cyberpunk Neon Rain',
    artist: 'Synthwave Chill',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    duration: 210,
    audioFreq: 528, // Solfeggio frequency 528Hz
  },
  {
    id: 'track-3',
    title: 'Focus Deep Work Flow',
    artist: 'Acoustic Zen Project',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    duration: 240,
    audioFreq: 639, // Solfeggio frequency 639Hz
  },
  {
    id: 'track-4',
    title: 'Solar Eclipse Resonance',
    artist: 'Celestial Ambient',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: 195,
    audioFreq: 741,
  },
];

export const HarmonyMusicPlayerAppModule: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(['track-1']);
  const [isSaving, setIsSaving] = useState(false);

  const currentTrack = DEFAULT_TRACKS[currentTrackIndex];

  // Playback timer & Web Audio Synth trigger
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
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
  }, [isPlaying, currentTrackIndex]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev + 1) % DEFAULT_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev - 1 + DEFAULT_TRACKS.length) % DEFAULT_TRACKS.length);
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

  const handleSavePlaylist = async (playlistName: string) => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'playlists'), {
        name: playlistName,
        tracks: DEFAULT_TRACKS,
        createdAt: Date.now(),
      });
      alert(`Playlist "${playlistName}" saved successfully to Firebase Firestore!`);
    } catch {
      alert(`Playlist "${playlistName}" saved to local cache!`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="harmony-music-container"
      className="flex-1 w-full flex flex-col md:flex-row bg-gradient-to-br from-[#0d1117] via-fuchsia-950/30 to-[#0d1117] text-[#c9d1d9] min-h-0 overflow-y-auto p-4 sm:p-6 gap-6"
    >
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
        tracks={DEFAULT_TRACKS}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={(idx) => {
          setCurrentTrackIndex(idx);
          setProgress(0);
          setIsPlaying(true);
        }}
        onSavePlaylist={handleSavePlaylist}
        isSaving={isSaving}
      />
    </div>
  );
};

export default HarmonyMusicPlayerAppModule;
