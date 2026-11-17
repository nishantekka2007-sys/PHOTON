'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedia } from '@/lib/context/media-context';
import { useAuth } from '@/lib/context/auth-context';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  FileImage, 
  FileVideo,
  FolderPlus,
  RefreshCw,
  Cloud,
  HardDrive
} from 'lucide-react';
import { formatBytes } from '@/lib/media/metadata';
import { modalBackdrop, modalContent, itemFadeUp } from '@/lib/motion';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAlbumId?: string;
}

export function UploadModal({ isOpen, onClose, targetAlbumId }: UploadModalProps) {
  const { uploadFiles, uploadQueue, albums } = useMedia();
  const { isCloudConnected } = useAuth();
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

  const completedCount = uploadQueue.filter((q) => q.status === 'completed').length;
  const errorCount = uploadQueue.filter((q) => q.status === 'error').length;
  const overallProgress = uploadQueue.length > 0
    ? Math.round((uploadQueue.reduce((acc, q) => acc + q.progress, 0) / (uploadQueue.length * 100)) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          variants={modalContent}
          initial="hidden"
          animate="show"
          exit="exit"
          className="relative w-full max-w-xl rounded-3xl bg-photon-dark border border-photon-border shadow-cinema p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-photon-border">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
                <Upload className="h-3 w-3" />
                <span>Media Acquisition Desk</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-white">
                Ingest Photographs & Film
              </h3>
              <p className="text-xs font-sans text-photon-light mt-0.5 font-light">
                {isCloudConnected
                  ? 'Private upload with PostgreSQL RLS & local cryptographic hashing.'
                  : 'Isolated local-first import to browser IndexedDB storage.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-photon-muted hover:text-white hover:bg-photon-card border border-transparent hover:border-photon-border transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Destination Album Picker */}
          {albums.length > 0 && (
            <div className="mt-4 flex items-center space-x-3 text-xs font-mono">
              <FolderPlus className="h-3.5 w-3.5 text-photon-muted" />
              <span className="text-photon-light uppercase tracking-wider text-[11px]">Destination Monograph:</span>
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="bg-photon-card border border-photon-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/40 transition-colors font-sans"
              >
                <option value="">Master Library (Unassigned)</option>
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Interactive Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-5 border border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 select-none ${
              isDragging
                ? 'border-white bg-photon-card scale-[0.99]'
                : 'border-photon-border hover:border-photon-subtle bg-photon-card/40'
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
            <div className="mx-auto h-12 w-12 rounded-2xl border border-photon-border bg-photon-dark flex items-center justify-center text-photon-light mb-3">
              <Upload className="h-5 w-5" />
            </div>
            <p className="font-serif text-lg text-white font-normal">
              Drop raw images or select files
            </p>
            <p className="text-xs font-mono text-photon-muted mt-1">
              Supports JPEG, PNG, WEBP, HEIC, MP4, WebM (up to 50MB per negative)
            </p>
          </div>

          {/* Active Upload Queue with Real Progress */}
          {uploadQueue.length > 0 && (
            <div className="mt-5 space-y-3">
              {/* Overall Progress Ribbon */}
              <div className="flex items-center justify-between text-xs font-mono text-photon-light">
                <span>
                  Acquiring {completedCount}/{uploadQueue.length} files
                  {errorCount > 0 && ` (${errorCount} failed)`}
                </span>
                <span>{overallProgress}%</span>
              </div>
              <div className="h-1 w-full bg-photon-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              {/* Individual Queue Item Cards */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 pt-1">
                {uploadQueue.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-photon-card border border-photon-border text-xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                      {item.file.type.startsWith('video/') ? (
                        <FileVideo className="h-4 w-4 text-accent-amber shrink-0" />
                      ) : (
                        <FileImage className="h-4 w-4 text-accent-titanium shrink-0" />
                      )}
                      <div className="truncate">
                        <p className="truncate font-sans font-medium text-white">
                          {item.file.name}
                        </p>
                        <p className="text-[10px] font-mono text-photon-muted">
                          {formatBytes(item.file.size)} &bull;{' '}
                          {item.status === 'hashing' && 'Calculating SHA-256...'}
                          {item.status === 'uploading' && 'Extracting EXIF & Storing...'}
                          {item.status === 'completed' && 'Stored in Vault'}
                          {item.status === 'error' && 'Failed'}
                          {item.status === 'queued' && 'Queued'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      {item.status === 'completed' && (
                        <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
                      )}
                      {item.status === 'error' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            uploadFiles([item.file], selectedAlbum || undefined);
                          }}
                          className="flex items-center space-x-1 text-accent-crimson hover:underline"
                          title="Retry file"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span className="text-[10px] font-mono">Retry</span>
                        </button>
                      )}
                      {(item.status === 'uploading' || item.status === 'hashing' || item.status === 'queued') && (
                        <Loader2 className="h-4 w-4 text-photon-light animate-spin" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy & Mode Footer */}
          <div className="mt-6 pt-4 border-t border-photon-border flex items-center justify-between text-[11px] font-mono text-photon-muted">
            <div className="flex items-center space-x-2">
              {isCloudConnected ? (
                <>
                  <Cloud className="h-3.5 w-3.5 text-accent-emerald" />
                  <span>Authenticated Cloud Ingestion</span>
                </>
              ) : (
                <>
                  <HardDrive className="h-3.5 w-3.5 text-accent-titanium" />
                  <span>Private Local Ingestion (Zero Network)</span>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-photon-card hover:bg-photon-border text-white transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
