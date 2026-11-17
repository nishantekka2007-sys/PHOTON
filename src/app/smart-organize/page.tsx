'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import { 
  Sparkles, 
  FolderPlus, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  Camera, 
  Search, 
  X, 
  Check, 
  ArrowRight, 
  CopyCheck, 
  Grid3X3, 
  FolderKanban, 
  Plus,
  SlidersHorizontal,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { springTactile, springBouncy, spatialFadeUp, staggerFast } from '@/lib/motion';

interface HistoryAction {
  type: 'move_to_album' | 'remove_from_album' | 'trash';
  mediaIds: string[];
  previousAlbumIds: Record<string, string | null>;
  targetAlbumId?: string;
  description: string;
}

export default function SmartOrganizePage() {
  const { 
    media, 
    albums, 
    createAlbum, 
    addMediaToAlbum, 
    moveToTrash, 
    findDuplicates, 
    restoreFromTrash 
  } = useMedia();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unorganized' | 'duplicates'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dropTargetAlbumId, setDropTargetAlbumId] = useState<string | null>(null);
  const [newAlbumInput, setNewAlbumInput] = useState('');
  const [showNewAlbumBar, setShowNewAlbumBar] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string>('');

  const activeMedia = useMemo(() => media.filter((m) => !m.is_deleted), [media]);

  const duplicates = useMemo(() => findDuplicates(), [findDuplicates]);
  const duplicateIdSet = useMemo(() => {
    const ids = new Set<string>();
    [...duplicates.exact, ...duplicates.similar].forEach((group) => {
      group.files.forEach((f) => ids.add(f.id));
    });
    return ids;
  }, [duplicates]);

  // Filtered items in the workspace
  const workspaceItems = useMemo(() => {
    let result = activeMedia;

    if (filterMode === 'unorganized') {
      result = result.filter((m) => !m.album_id);
    } else if (filterMode === 'duplicates') {
      result = result.filter((m) => duplicateIdSet.has(m.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.filename.toLowerCase().includes(q) ||
          m.original_name.toLowerCase().includes(q) ||
          m.metadata.camera_model?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeMedia, filterMode, duplicateIdSet, searchQuery]);

  const showNotification = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(''), 3500);
  };

  // Selection toggle
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === workspaceItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(workspaceItems.map((m) => m.id));
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setActiveDragId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, albumId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetAlbumId !== albumId) {
      setDropTargetAlbumId(albumId);
    }
  };

  const handleDragLeave = () => {
    setDropTargetAlbumId(null);
  };

  const handleDropOnAlbum = async (e: React.DragEvent, albumId: string) => {
    e.preventDefault();
    setDropTargetAlbumId(null);
    const draggedId = e.dataTransfer.getData('text/plain') || activeDragId;
    if (!draggedId) return;

    const idsToMove = selectedIds.includes(draggedId) ? selectedIds : [draggedId];
    const prevMap: Record<string, string | null> = {};
    idsToMove.forEach((id) => {
      const item = activeMedia.find((m) => m.id === id);
      prevMap[id] = item?.album_id || null;
    });

    await addMediaToAlbum(idsToMove, albumId);

    const album = albums.find((a) => a.id === albumId);
    const actionDesc = `Routed ${idsToMove.length} negative(s) to "${album?.name || 'Collection'}"`;
    setHistory((prev) => [
      {
        type: 'move_to_album',
        mediaIds: idsToMove,
        previousAlbumIds: prevMap,
        targetAlbumId: albumId,
        description: actionDesc,
      },
      ...prev,
    ]);

    setSelectedIds([]);
    setActiveDragId(null);
    showNotification(actionDesc);
  };

  const handleRemoveFromAlbum = async (mediaIds: string[]) => {
    const prevMap: Record<string, string | null> = {};
    mediaIds.forEach((id) => {
      const item = activeMedia.find((m) => m.id === id);
      prevMap[id] = item?.album_id || null;
    });

    await addMediaToAlbum(mediaIds, '');

    const actionDesc = `Unbound ${mediaIds.length} negative(s) from collection`;
    setHistory((prev) => [
      {
        type: 'remove_from_album',
        mediaIds,
        previousAlbumIds: prevMap,
        description: actionDesc,
      },
      ...prev,
    ]);

    setSelectedIds([]);
    showNotification(actionDesc);
  };

  // Undo previous action
  const handleUndo = async () => {
    if (history.length === 0) return;
    const [lastAction, ...rest] = history;

    if (lastAction.type === 'move_to_album' || lastAction.type === 'remove_from_album') {
      // Restore previous album states
      for (const id of lastAction.mediaIds) {
        const prevAlbumId = lastAction.previousAlbumIds[id];
        await addMediaToAlbum([id], prevAlbumId || '');
      }
      showNotification(`Reverted: ${lastAction.description}`);
    }

    setHistory(rest);
  };

  // Create new collection
  const handleCreateNewAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumInput.trim()) return;
    const created = await createAlbum(newAlbumInput.trim());
    setNewAlbumInput('');
    setShowNewAlbumBar(false);
    showNotification(`Created collection "${created.name}"`);
  };

  // Zoom controls
  const zoomIn = () => setZoomScale((prev) => Math.min(prev + 0.15, 1.45));
  const zoomOut = () => setZoomScale((prev) => Math.max(prev - 0.15, 0.75));
  const resetZoom = () => setZoomScale(1);

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 select-none">
        {/* Workspace Header & Command Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-photon-border">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Signature Spatial Studio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Spatial Organization Canvas
            </h1>
            <p className="text-xs font-sans text-photon-light mt-1 font-light">
              Arrange negatives visually. Drag media cards directly into destination monographs or quarantine trays with real-time state persistence.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-full bg-photon-card border border-photon-border text-[11px]">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filterMode === 'all'
                    ? 'bg-photon-ivory text-photon-obsidian font-semibold shadow-sm'
                    : 'text-photon-muted hover:text-white'
                }`}
              >
                All ({activeMedia.length})
              </button>
              <button
                onClick={() => setFilterMode('unorganized')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filterMode === 'unorganized'
                    ? 'bg-photon-ivory text-photon-obsidian font-semibold shadow-sm'
                    : 'text-photon-muted hover:text-white'
                }`}
              >
                Unorganized ({activeMedia.filter((m) => !m.album_id).length})
              </button>
              <button
                onClick={() => setFilterMode('duplicates')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filterMode === 'duplicates'
                    ? 'bg-accent-amber text-photon-obsidian font-semibold shadow-sm'
                    : 'text-photon-muted hover:text-white'
                }`}
              >
                Duplicates ({duplicateIdSet.size})
              </button>
            </div>

            {/* Undo Action */}
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-full border border-photon-border bg-photon-card hover:bg-photon-border disabled:opacity-30 text-photon-light hover:text-white transition-colors"
              title="Undo previous arrangement"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center space-x-1 p-1 rounded-full bg-photon-card border border-photon-border text-xs">
              <button
                onClick={zoomOut}
                disabled={zoomScale <= 0.75}
                className="p-1.5 rounded-full hover:bg-photon-border disabled:opacity-30 text-photon-light hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              <button
                onClick={resetZoom}
                className="px-2 py-0.5 text-[10px] rounded-full hover:bg-photon-border text-photon-light hover:text-white"
                title="Reset Zoom"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={zoomScale >= 1.45}
                className="p-1.5 rounded-full hover:bg-photon-border disabled:opacity-30 text-photon-light hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
            </div>

            {/* Select All */}
            <button
              onClick={selectAll}
              className="px-3 py-1.5 rounded-full border border-photon-border bg-photon-card hover:bg-photon-border text-photon-light hover:text-white transition-colors text-[11px]"
            >
              {selectedIds.length === workspaceItems.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>

        {/* Live Status Notification Banner */}
        <AnimatePresence>
          {statusNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {statusNotice}
              </span>
              <button onClick={() => setStatusNotice('')} className="p-1 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Spatial Canvas: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Media Ingestion Tray (Canvas Left / 8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search & Counter Ribbon */}
            <div className="flex items-center justify-between text-xs font-mono text-photon-muted pb-2 border-b border-photon-border/60">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-photon-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter cards in canvas..."
                  className="w-full rounded-full bg-photon-card border border-photon-border pl-8 pr-4 py-1 text-xs text-white placeholder-photon-muted focus:outline-none focus:border-white/30"
                />
              </div>

              <span>
                {workspaceItems.length} {workspaceItems.length === 1 ? 'negative' : 'negatives'} in view
              </span>
            </div>

            {/* Canvas Card Board */}
            {workspaceItems.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-photon-border rounded-3xl bg-photon-dark/50 space-y-3">
                <Layers className="h-8 w-8 text-photon-muted mx-auto stroke-1" />
                <p className="font-serif text-lg text-white">No negatives match current canvas filter</p>
                <p className="text-xs font-sans text-photon-light">
                  {filterMode === 'unorganized'
                    ? 'All active negatives are bound to collections.'
                    : 'Ingest photographs or adjust filter criteria above.'}
                </p>
              </div>
            ) : (
              <motion.div
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease-out',
                }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5"
              >
                {workspaceItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isDuplicate = duplicateIdSet.has(item.id);
                  const boundAlbum = albums.find((a) => a.id === item.album_id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, item.id)}
                      onClick={() => toggleSelect(item.id)}
                      className={`group relative rounded-2xl overflow-hidden border bg-photon-card p-2.5 cursor-grab active:cursor-grabbing transition-all select-none shadow-sm ${
                        isSelected
                          ? 'border-white ring-2 ring-white/50 scale-[0.98]'
                          : isDuplicate
                          ? 'border-accent-amber/50 hover:border-accent-amber'
                          : 'border-photon-border hover:border-photon-subtle'
                      }`}
                    >
                      {/* Negative Thumbnail Frame */}
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-black mb-2 relative border border-white/5">
                        <img
                          src={item.thumbnail_url || item.data_url}
                          alt={item.filename}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        />

                        {/* Bound Album Tag */}
                        {boundAlbum && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-mono text-accent-gold border border-accent-gold/20 truncate max-w-[120px]">
                            {boundAlbum.name}
                          </div>
                        )}

                        {/* Duplicate Alert Pill */}
                        {isDuplicate && (
                          <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-accent-amber/90 text-photon-obsidian font-mono text-[9px] font-bold uppercase tracking-wider">
                            Duplicate Group
                          </div>
                        )}

                        {/* Selection Checkmark */}
                        <div
                          className={`absolute top-1.5 right-1.5 h-5 w-5 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-white border-white text-photon-obsidian'
                              : 'bg-black/50 border-white/40 text-transparent opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      </div>

                      {/* Card Title & Optics Telemetry */}
                      <p className="font-serif text-xs text-white truncate font-normal">
                        {item.original_name || item.filename}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-photon-muted mt-1">
                        <span className="truncate">
                          {item.metadata.camera_model ? item.metadata.camera_model : formatBytes(item.file_size)}
                        </span>
                        {item.metadata.f_number && <span>ƒ/{item.metadata.f_number}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Destination Drop Target Shelf (Canvas Right / 4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-photon-border/60 text-xs font-mono">
              <span className="uppercase text-photon-muted tracking-wider font-semibold">
                Destination Collections
              </span>
              <button
                onClick={() => setShowNewAlbumBar(!showNewAlbumBar)}
                className="flex items-center gap-1 text-accent-gold hover:text-amber-400 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>New</span>
              </button>
            </div>

            {/* Quick New Album Form */}
            {showNewAlbumBar && (
              <form onSubmit={handleCreateNewAlbum} className="p-3 rounded-2xl bg-photon-card border border-photon-border space-y-2">
                <input
                  type="text"
                  autoFocus
                  value={newAlbumInput}
                  onChange={(e) => setNewAlbumInput(e.target.value)}
                  placeholder="Collection title..."
                  className="w-full rounded-xl bg-photon-dark border border-photon-border px-3 py-1.5 text-xs text-white placeholder-photon-muted focus:outline-none focus:border-white/40"
                />
                <div className="flex justify-end gap-2 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setShowNewAlbumBar(false)}
                    className="px-2.5 py-1 text-photon-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-photon-ivory text-photon-obsidian font-semibold rounded-lg uppercase tracking-wider"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            {/* Drop Target Album Binders */}
            <div className="space-y-2.5">
              {albums.map((album) => {
                const isTarget = dropTargetAlbumId === album.id;
                const albumCount = activeMedia.filter((m) => m.album_id === album.id).length;

                return (
                  <div
                    key={album.id}
                    onDragOver={(e) => handleDragOver(e, album.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropOnAlbum(e, album.id)}
                    className={`group relative p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isTarget
                        ? 'border-accent-gold bg-accent-gold/15 scale-[1.02] shadow-cinema'
                        : 'border-photon-border bg-photon-card/80 hover:border-photon-subtle'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-photon-dark border border-white/5 flex items-center justify-center text-accent-gold overflow-hidden shrink-0">
                        {album.cover_url ? (
                          <img src={album.cover_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <FolderKanban className="h-4 w-4" />
                        )}
                      </div>
                      <div className="truncate max-w-[160px]">
                        <p className="font-serif text-sm text-white truncate font-normal group-hover:text-accent-gold transition-colors">
                          {album.name}
                        </p>
                        <p className="text-[10px] font-mono text-photon-muted mt-0.5">
                          {albumCount} {albumCount === 1 ? 'negative' : 'negatives'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs font-mono">
                      {selectedIds.length > 0 && (
                        <button
                          onClick={() => handleDropOnAlbum({ preventDefault: () => {} } as any, album.id)}
                          className="px-2.5 py-1 rounded-lg bg-photon-ivory text-photon-obsidian font-semibold text-[10px] uppercase tracking-wider"
                          title="Assign selected negatives"
                        >
                          Move ({selectedIds.length})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Unbind / Remove from Album Drop Zone */}
              <div
                onDragOver={(e) => handleDragOver(e, 'unbind_zone')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  setDropTargetAlbumId(null);
                  const draggedId = e.dataTransfer.getData('text/plain') || activeDragId;
                  if (!draggedId) return;
                  const idsToMove = selectedIds.includes(draggedId) ? selectedIds : [draggedId];
                  handleRemoveFromAlbum(idsToMove);
                }}
                className={`p-3 rounded-2xl border border-dashed transition-all flex items-center justify-between ${
                  dropTargetAlbumId === 'unbind_zone'
                    ? 'border-white bg-white/10 scale-[1.02]'
                    : 'border-photon-border/60 bg-photon-dark/40 text-photon-muted'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl border border-photon-border bg-photon-card flex items-center justify-center text-photon-muted">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-serif text-xs text-white">Uncataloged Library Tray</p>
                    <p className="text-[9px] font-mono text-photon-muted">Drop here to remove from album</p>
                  </div>
                </div>
              </div>

              {/* Duplicate Quarantine Tray Drop Target */}
              <div
                onDragOver={(e) => handleDragOver(e, 'trash_zone')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  setDropTargetAlbumId(null);
                  const draggedId = e.dataTransfer.getData('text/plain') || activeDragId;
                  if (!draggedId) return;
                  const idsToMove = selectedIds.includes(draggedId) ? selectedIds : [draggedId];
                  moveToTrash(idsToMove);
                  showNotification(`Moved ${idsToMove.length} negative(s) to Recently Deleted.`);
                  setSelectedIds([]);
                }}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  dropTargetAlbumId === 'trash_zone'
                    ? 'border-red-400 bg-red-950/40 scale-[1.02]'
                    : 'border-red-950/40 bg-red-950/10 text-red-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl border border-red-900/50 bg-red-950/40 flex items-center justify-center text-accent-crimson">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-serif text-xs text-red-200">Recently Deleted Bin</p>
                    <p className="text-[9px] font-mono text-red-400">Drop here to archive negatives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
