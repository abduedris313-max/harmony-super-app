/**
 * Harmony Music Player - Core Type Definitions
 */

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // in seconds
  audioFreq: number; // synthesizer frequency for live web audio
}

export interface PlaylistData {
  id: string;
  name: string;
  tracks: TrackItem[];
  updatedAt: number;
}
