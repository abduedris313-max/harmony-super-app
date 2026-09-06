/**
 * @file AppCatalogTable.tsx
 * @description Comprehensive catalog table and grid manager for Harmony mini-apps.
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Github, 
  Star, 
  Download, 
  Edit3, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  ArrowUpDown,
  Tag,
  ShieldCheck,
  RotateCcw,
  LayoutGrid,
  List
} from 'lucide-react';
import { AdminMiniApp, AppPublishStatus } from '../types';

interface AppCatalogTableProps {
  apps: AdminMiniApp[];
  isDarkMode: boolean;
  onSelectApp: (app: AdminMiniApp) => void;
  onOpenPublishModal: () => void;
  onDeleteApp: (appId: string) => void;
  onOpenSandbox: (app: AdminMiniApp) => void;
  onQuickStatusChange: (appId: string, status: AppPublishStatus) => void;
}

export const AppCatalogTable: React.FC<AppCatalogTableProps> = ({
  apps,
  isDarkMode,
  onSelectApp,
  onOpenPublishModal,
  onDeleteApp,
  onOpenSandbox,
  onQuickStatusChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'downloads' | 'rating' | 'version'>('downloads');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'finance', label: 'Finance' },
    { id: 'audio', label: 'Audio' },
    { id: 'ai', label: 'AI Intelligence' },
    { id: 'developer', label: 'Developer Tools' },
    { id: 'health', label: 'Health & Wellness' },
  ];

  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'published', label: 'Published' },
    { id: 'in_review', label: 'In Review' },
    { id: 'draft', label: 'Draft' },
    { id: 'deprecated', label: 'Deprecated' },
  ];

  // Filter and Sort
  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesSearch = 
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.author?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
        const currentStatus = app.status || 'published';
        const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy] || 0;
        let valB: any = b[sortBy] || 0;
        if (sortBy === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        }
        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        }
        return valA < valB ? 1 : -1;
      });
  }, [apps, searchQuery, categoryFilter, statusFilter, sortBy, sortOrder]);

  const getStatusBadge = (status?: AppPublishStatus) => {
    const s = status || 'published';
    switch (s) {
      case 'published':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Published
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Review
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 flex items-center gap-1">
            Draft
          </span>
        );
      case 'deprecated':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Deprecated
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mini apps by name, id, category, or author..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500' 
                : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
          />
        </div>

        {/* Filter and View Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border font-medium focus:outline-none cursor-pointer ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border font-medium focus:outline-none cursor-pointer ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Display */}
      {filteredApps.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold mb-1">No mini apps matched your filter</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
            Try adjusting your search query, category, or status filter to see packages.
          </p>
          <button
            onClick={onOpenPublishModal}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-all cursor-pointer"
          >
            Publish New Mini App
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <th className="py-3 px-4">Mini App</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredApps.map((app) => (
                  <tr 
                    key={app.id}
                    className={`transition-colors group ${
                      isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* App Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: app.bgHex || '#3b82f6' }}
                        >
                          {app.iconCdnUrl ? (
                            <img 
                              src={app.iconCdnUrl} 
                              alt={app.name} 
                              className="w-5 h-5 object-contain invert brightness-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Layers className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <span className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>{app.name}</span>
                            {app.isSystemApp && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Core
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono line-clamp-1 max-w-[200px]">
                            {app.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-medium text-slate-300">
                        {app.category}
                      </span>
                    </td>

                    {/* Version Column */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        v{app.version || '1.0.0'}
                      </span>
                    </td>

                    {/* Size Column */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {app.size || '1.5 MB'}
                    </td>

                    {/* Downloads Column */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                      {(app.downloadsCount || 0).toLocaleString()}
                    </td>

                    {/* Rating Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{app.rating ? app.rating.toFixed(1) : '5.0'}</span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Test Sandbox */}
                        <button
                          onClick={() => onOpenSandbox(app)}
                          className="p-1.5 rounded-lg border transition-all text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                          title="Run in Test Sandbox"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>

                        {/* Inspect & Edit */}
                        <button
                          onClick={() => onSelectApp(app)}
                          className="p-1.5 rounded-lg border transition-all text-slate-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10"
                          title="Inspect & Edit Metadata"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete / Remove (if not system app) */}
                        {!app.isSystemApp && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${app.name}" from central repository?`)) {
                                onDeleteApp(app.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border transition-all text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10"
                            title="Unpublish Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group hover:border-blue-500/40 hover:shadow-lg ${
                isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                      style={{ backgroundColor: app.bgHex || '#3b82f6' }}
                    >
                      {app.iconCdnUrl ? (
                        <img 
                          src={app.iconCdnUrl} 
                          alt={app.name} 
                          className="w-6 h-6 object-contain invert brightness-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Layers className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{app.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{app.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {app.tagline || app.description}
                </p>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl mb-4 text-center text-xs font-mono border border-slate-800/40 bg-slate-950/30">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Version</div>
                    <div className="font-semibold text-slate-200">v{app.version || '1.0'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Size</div>
                    <div className="font-semibold text-slate-200">{app.size || '1.5MB'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Downloads</div>
                    <div className="font-semibold text-blue-400">{(app.downloadsCount || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                <span className="text-[11px] text-slate-400 capitalize flex items-center gap-1 font-medium">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {app.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSandbox(app)}
                    className="px-2.5 py-1 rounded-lg border text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Test</span>
                  </button>
                  <button
                    onClick={() => onSelectApp(app)}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-blue-600/30"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Manage</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
