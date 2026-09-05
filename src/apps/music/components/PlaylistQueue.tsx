import React, { useState } from 'react';
import { Disc, Save, Music, Plus, Radio } from 'lucide-react';
import { TrackItem } from '../types';

interface PlaylistQueueProps {
  tracks: TrackItem[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  onSavePlaylist: (playlistName: string) => void;
  onAddCustomTrack?: (title: string, freq: number) => void;
  isSaving: boolean;
}

export const PlaylistQueue: React.FC<PlaylistQueueProps> = ({
  tracks,
  currentTrackIndex,
  onSelectTrack,
  onSavePlaylist,
  onAddCustomTrack,
  isSaving,
}) => {
  const [playlistName, setPlaylistName] = useState('');
  const [isAddingTone, setIsAddingTone] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFreq, setNewFreq] = useState(432);

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

  const handleAddToneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFreq || !onAddCustomTrack) return;
    onAddCustomTrack(newTitle.trim() || `${newFreq} Hz Pure Tone`, newFreq);
    setNewTitle('');
    setIsAddingTone(false);
  };

  return (
    <div className="w-full md:w-72 bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] p-3.5 rounded-2xl flex flex-col justify-between shrink-0 shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>Solfeggio Channels ({tracks.length})</span>
          </h4>
          <button
            type="button"
            onClick={() => setIsAddingTone(!isAddingTone)}
            className="p-1 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[10px]">Add Tone</span>
          </button>
        </div>

        {isAddingTone && (
          <form onSubmit={handleAddToneSubmit} className="mb-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#30363d] space-y-2">
            <div className="text-[11px] font-bold text-neutral-800 dark:text-white">Add Synthesizer Channel</div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Theta Waves (528 Hz)"
              className="w-full bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] text-xs text-neutral-900 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-none placeholder-neutral-400"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={20}
                max={20000}
                value={newFreq}
                onChange={(e) => setNewFreq(parseInt(e.target.value) || 432)}
                className="w-24 bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] text-xs font-mono text-neutral-900 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Hz</span>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-fuchsia-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-fuchsia-500 transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Track List */}
        <div className="space-y-1.5 mb-4 max-h-60 md:max-h-80 overflow-y-auto scrollbar-none pr-0.5">
          {tracks.map((t, index) => {
            const isCurrent = currentTrackIndex === index;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTrack(index)}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${
                  isCurrent
                    ? 'bg-fuchsia-50 dark:bg-fuchsia-500/20 border-fuchsia-400 dark:border-fuchsia-500/50 text-neutral-900 dark:text-white shadow-xs'
                    : 'bg-neutral-50 dark:bg-[#0d1117] border-neutral-200 dark:border-[#30363d] text-neutral-700 dark:text-[#c9d1d9] hover:border-fuchsia-300 dark:hover:border-[#58a6ff]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono text-neutral-400 dark:text-[#8b949e] shrink-0">{t.audioFreq}Hz</span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold truncate max-w-[140px] text-neutral-900 dark:text-white">{t.title}</h5>
                    <p className="text-[10px] text-neutral-500 dark:text-[#8b949e] truncate">{t.artist}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 dark:text-[#8b949e] shrink-0">{formatTime(t.duration)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Custom Playlist to Firebase */}
      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#30363d]">
        <label className="text-[11px] font-semibold text-fuchsia-700 dark:text-fuchsia-300 block mb-1.5">
          Save Preset List (Firestore)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="My Focus Ambient..."
            className="flex-1 bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] text-xs text-neutral-900 dark:text-white rounded-xl px-2.5 py-1.5 focus:outline-none placeholder-neutral-400 dark:placeholder-[#8b949e]"
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
