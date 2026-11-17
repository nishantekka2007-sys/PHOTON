import exifr from 'exifr';
import { MediaMetadata, MediaType } from '@/types';

/**
 * Extracts comprehensive metadata from photos and videos purely in the browser.
 * Privacy-first: Zero data sent to any cloud server during extraction.
 */
export async function extractMediaMetadata(
  file: File,
  mediaType: MediaType
): Promise<{ metadata: MediaMetadata; thumbnailUrl?: string }> {
  const metadata: MediaMetadata = {};

  try {
    if (mediaType === 'image') {
      // Extract EXIF data using exifr
      try {
        const exifData = await exifr.parse(file, {
          tiff: true,
          exif: true,
          gps: true,
          xmp: false,
          icc: false,
        });

        if (exifData) {
          metadata.camera_make = exifData.Make;
          metadata.camera_model = exifData.Model;
          metadata.taken_at = exifData.DateTimeOriginal 
            ? new Date(exifData.DateTimeOriginal).toISOString() 
            : (exifData.CreateDate ? new Date(exifData.CreateDate).toISOString() : new Date(file.lastModified).toISOString());
          
          if (exifData.latitude !== undefined && exifData.longitude !== undefined) {
            metadata.latitude = Number(exifData.latitude.toFixed(6));
            metadata.longitude = Number(exifData.longitude.toFixed(6));
          }

          if (exifData.ISO) metadata.iso = exifData.ISO;
          if (exifData.FocalLength) metadata.focal_length = `${exifData.FocalLength}mm`;
          if (exifData.FNumber) metadata.f_number = exifData.FNumber;
          if (exifData.ExposureTime) {
            metadata.exposure_time = exifData.ExposureTime < 1 
              ? `1/${Math.round(1 / exifData.ExposureTime)}s` 
              : `${exifData.ExposureTime}s`;
          }
        }
      } catch (err) {
        // Fallback to file modified date
        metadata.taken_at = new Date(file.lastModified).toISOString();
      }

      if (!metadata.taken_at) {
        metadata.taken_at = new Date(file.lastModified).toISOString();
      }

      // Read image dimensions and create a fast thumbnail
      const thumbnailData = await new Promise<{ width: number; height: number; thumbnailUrl: string }>(
        (resolve) => {
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            // Generate 400px thumbnail canvas
            const canvas = document.createElement('canvas');
            const maxDim = 400;
            let thumbW = width;
            let thumbH = height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                thumbW = maxDim;
                thumbH = Math.round((height * maxDim) / width);
              } else {
                thumbH = maxDim;
                thumbW = Math.round((width * maxDim) / height);
              }
            }
            canvas.width = thumbW;
            canvas.height = thumbH;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, thumbW, thumbH);
              const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);
              URL.revokeObjectURL(objectUrl);
              resolve({ width, height, thumbnailUrl });
            } else {
              URL.revokeObjectURL(objectUrl);
              resolve({ width, height, thumbnailUrl: objectUrl });
            }
          };

          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ width: 0, height: 0, thumbnailUrl: '' });
          };

          img.src = objectUrl;
        }
      );

      metadata.width = thumbnailData.width;
      metadata.height = thumbnailData.height;

      return { metadata, thumbnailUrl: thumbnailData.thumbnailUrl };
    } else {
      // Process video file
      metadata.taken_at = new Date(file.lastModified).toISOString();
      
      const videoData = await new Promise<{ width: number; height: number; duration: number; thumbnailUrl: string }>(
        (resolve) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          const objectUrl = URL.createObjectURL(file);
          
          video.onloadedmetadata = () => {
            const width = video.videoWidth;
            const height = video.videoHeight;
            const duration = Math.round(video.duration);

            // Seek to 1 second or 10% to capture representative thumbnail
            video.currentTime = Math.min(1.0, video.duration / 4);
          };

          video.onseeked = () => {
            try {
              const canvas = document.createElement('canvas');
              const maxDim = 400;
              let thumbW = video.videoWidth || 320;
              let thumbH = video.videoHeight || 180;
              if (thumbW > maxDim || thumbH > maxDim) {
                if (thumbW > thumbH) {
                  thumbH = Math.round((thumbH * maxDim) / thumbW);
                  thumbW = maxDim;
                } else {
                  thumbW = Math.round((thumbW * maxDim) / thumbH);
                  thumbH = maxDim;
                }
              }
              canvas.width = thumbW;
              canvas.height = thumbH;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, thumbW, thumbH);
                const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
                URL.revokeObjectURL(objectUrl);
                resolve({
                  width: video.videoWidth,
                  height: video.videoHeight,
                  duration: Math.round(video.duration),
                  thumbnailUrl,
                });
                return;
              }
            } catch (e) {
              // canvas may be tainted in some rare cases
            }
            URL.revokeObjectURL(objectUrl);
            resolve({
              width: video.videoWidth,
              height: video.videoHeight,
              duration: Math.round(video.duration),
              thumbnailUrl: '',
            });
          };

          video.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ width: 0, height: 0, duration: 0, thumbnailUrl: '' });
          };

          video.src = objectUrl;
        }
      );

      metadata.width = videoData.width;
      metadata.height = videoData.height;
      metadata.duration = videoData.duration;

      return { metadata, thumbnailUrl: videoData.thumbnailUrl };
    }
  } catch (error) {
    console.warn('Error during metadata extraction:', error);
    return {
      metadata: {
        taken_at: new Date(file.lastModified).toISOString(),
      },
    };
  }
}

/**
 * Format bytes to readable human strings (KB, MB, GB).
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format video duration in seconds to MM:SS or HH:MM:SS.
 */
export function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

