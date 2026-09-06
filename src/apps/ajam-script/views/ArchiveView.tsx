import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  MapPin, 
  Music, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Heart, 
  Bookmark, 
  Play, 
  Feather 
} from 'lucide-react';
import { Manuscript, AjamRegion, AjamLanguage, AjamCategory } from '../types';

interface ArchiveViewProps {
  manuscripts: Manuscript[];
  savedIds: string[];
  onSelectManuscript: (m: Manuscript) => void;
  onSavedToggle: (manuscriptId: string) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  manuscripts,
  savedIds,
  onSelectManuscript,
  onSavedToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<AjamRegion | 'All'>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<AjamLanguage | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<AjamCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = manuscripts.filter(m => {
    const matchesQuery = 
      m.titleAjam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.titleEthiopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || m.region === selectedRegion;
    const matchesLanguage = selectedLanguage === 'All' || m.language === selectedLanguage;
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;

    return matchesQuery && matchesRegion && matchesLanguage && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 p-6 sm:p-8 border border-amber-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.12),transparent_70%)]" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Feather className="w-3.5 h-3.5" />
            Digital Preservation Initiative
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Ethiopian Sufi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 font-ajam">Ajam</span> Manuscripts
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover digitized 18th and 19th-century manuscripts transcribing Amharic, Afaan Oromo, Harari, and Silte religious poetry into adapted Arabic script.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="glass-card p-4 rounded-2xl space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author (e.g. Sheikh Rayya), or keyword..."
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-700/80 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs transition-colors ${viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs transition-colors ${viewMode === 'list' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category & Region Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1 text-[11px]">
            <Filter className="w-3 h-3 text-amber-400" /> Filter Region:
          </span>
          {(['All', 'Wollo', 'Harar', 'Bale', 'Silte', 'Jimma', 'Raya'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg as any)}
              className={`px-3 py-1 rounded-xl transition-all ${
                selectedRegion === reg 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

      </div>

      {/* Manuscript Grid List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-amber-400/50 mx-auto" />
          <h3 className="font-bold text-slate-200">No Manuscripts Found</h3>
          <p className="text-xs text-slate-400">Try loosening your search query or region filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all duration-300 group flex flex-col cursor-pointer"
                onClick={() => onSelectManuscript(item)}
              >
                {/* Image Header */}
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.titleEnglish}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/20">
                      {item.region}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      {item.language}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSavedToggle(item.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                      isSaved ? 'bg-amber-500 text-slate-950' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-ajam font-bold text-xl text-amber-300 leading-snug line-clamp-1" dir="rtl">
                      {item.titleAjam}
                    </h3>
                    <h4 className="font-semibold text-sm text-slate-100 line-clamp-1">
                      {item.titleEnglish}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-300 truncate max-w-[150px]">
                      ✍️ {item.author}
                    </span>
                    <div className="flex items-center gap-3">
                      {item.audioUrl && (
                        <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                          <Music className="w-3 h-3" /> Audio
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                        <Heart className="w-3 h-3 fill-rose-500/30" /> {item.likesCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectManuscript(item)}
              className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-amber-500/40 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                <div className="space-y-1">
                  <h3 className="font-ajam font-bold text-lg text-amber-300" dir="rtl">{item.titleAjam}</h3>
                  <p className="text-xs font-semibold text-slate-200">{item.titleEnglish}</p>
                  <p className="text-[11px] text-slate-400">{item.author} • {item.region} ({item.language})</p>
                </div>
              </div>
              <button className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors">
                Read
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
