'use client';

import React, { useState, useRef } from 'react';
import { useMedia } from '@/lib/context/media-context';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  FileImage, 
  FileVideo,
  FolderPlus
} from 'lucide-react';
import { formatBytes } from '@/lib/media/metadata';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAlbumId?: string;
}

export function UploadModal({ isOpen, onClose, targetAlbumId }: UploadModalProps) {
  const { uploadFiles, uploadQueue, albums } = useMedia();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string>(targetAlbumId || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files, selectedAlbum || undefined);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files, selectedAlbum || undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Upload className="h-4 w-4 text-indigo-500" />
              Upload Photos & Videos
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Secure in-browser hashing & EXIF metadata extraction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Optional Album Assignment */}
        {albums.length > 0 && (
          <div className="mt-4 flex items-center space-x-2 text-xs">
            <FolderPlus className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Add to Album:</span>
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">No album (Root library)</option>
              {albums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  {alb.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Drag and Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.99]'
              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Click to browse or drag & drop files here
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Supports JPEG, PNG, WEBP, HEIC, MP4, WebM (up to 50MB per file)
          </p>
        </div>

        {/* Active Upload Queue Items */}
        {uploadQueue.length > 0 && (
          <div className="mt-4 max-h-48 overflow-y-auto space-y-2 pr-1">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Processing Queue ({uploadQueue.length})
            </p>
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-3">
                  {item.file.type.startsWith('video/') ? (
                    <FileVideo className="h-4 w-4 text-amber-500 shrink-0" />
                  ) : (
                    <FileImage className="h-4 w-4 text-indigo-500 shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                      {item.file.name}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {formatBytes(item.file.size)} • {item.status}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  {item.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                  )}
                  {(item.status === 'uploading' || item.status === 'hashing' || item.status === 'queued') && (
                    <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Privacy Note */}
        <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Zero telemetry • Processed in browser sandbox</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
