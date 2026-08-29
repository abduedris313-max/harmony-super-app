import React, { useState } from 'react';
import { Disc, Save, CloudCheck, Music } from 'lucide-react';
import { TrackItem } from '../types';

interface PlaylistQueueProps {
  tracks: TrackItem[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  onSavePlaylist: (playlistName: string) => void;
  isSaving: boolean;
}

export const PlaylistQueue: React.FC<PlaylistQueueProps> = ({
  tracks,
  currentTrackIndex,
  onSelectTrack,
  onSavePlaylist,
  isSaving,
}) => {
  const [playlistName, setPlaylistName] = useState('');

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleSave = () => {
    if (!playlistName.trim()) return;
    onSavePlaylist(playlistName.trim());
    setPlaylistName('');
  };

  return (
    <div className="w-full md:w-64 bg-[#161b22] border border-[#30363d] p-3 rounded-xl flex flex-col justify-between shrink-0">
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-400 mb-2.5 flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5" />
          <span>Harmony Lo-Fi Queue</span>
        </h4>

        {/* Track List */}
        <div className="space-y-2 mb-6 max-h-60 md:max-h-80 overflow-y-auto scrollbar-none">
          {tracks.map((t, index) => {
            const isCurrent = currentTrackIndex === index;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTrack(index)}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${
                  isCurrent
                    ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-white shadow-md'
                    : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-[#8b949e] shrink-0">{index + 1}</span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold truncate max-w-[140px] text-white">{t.title}</h5>
                    <p className="text-[10px] text-[#8b949e] truncate">{t.artist}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#8b949e] shrink-0">{formatTime(t.duration)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Custom Playlist to Firebase */}
      <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
        <label className="text-[11px] font-semibold text-fuchsia-300 block mb-1.5">
          Save Custom Playlist (Firebase)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="My Chill Playlist..."
            className="flex-1 bg-[#161b22] border border-[#30363d] text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none placeholder-[#8b949e]"
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
