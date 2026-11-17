/**
 * Cryptographic & Perceptual Hashing Utilities
 * Zero external paid dependencies - uses standard Web Crypto API and HTML5 Canvas
 */

/**
 * Computes exact SHA-256 hash of a file or ArrayBuffer using browser native Web Crypto API.
 */
export async function computeSHA256(data: File | Blob | ArrayBuffer): Promise<string> {
  let buffer: ArrayBuffer;
  if (data instanceof ArrayBuffer) {
    buffer = data;
  } else {
    buffer = await data.arrayBuffer();
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexString = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexString;
}

/**
 * Computes 64-bit Difference Hash (dHash) for an image.
 * Resizes the image to 9x8, converts to grayscale, and compares adjacent pixels.
 * Fast, robust to aspect ratio preserving resizing, minor color shifts, and compression.
 */
export async function computePerceptualHash(imageSource: string | Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 9;
        canvas.height = 8;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          resolve('0000000000000000');
          return;
        }

        ctx.drawImage(img, 0, 0, 9, 8);
        const imgData = ctx.getImageData(0, 0, 9, 8).data;

        // Convert to grayscale values
        const grays: number[][] = [];
        for (let y = 0; y < 8; y++) {
          grays[y] = [];
          for (let x = 0; x < 9; x++) {
            const idx = (y * 9 + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            // Standard perceptual luminance formula
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            grays[y].push(gray);
          }
        }

        // Compare adjacent pixels: 8 rows * 8 comparisons = 64 bits
        let hash = '';
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            hash += grays[y][x] < grays[y][x + 1] ? '1' : '0';
          }
        }

        // Convert 64-bit binary string to 16-character hexadecimal string
        let hexHash = '';
        for (let i = 0; i < hash.length; i += 4) {
          const nibble = hash.substring(i, i + 4);
          hexHash += parseInt(nibble, 2).toString(16);
        }

        // Clean up object URL if created
        if (typeof imageSource !== 'string' && img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }

        resolve(hexHash);
      } catch (err) {
        console.warn('Failed to compute perceptual hash:', err);
        resolve('0000000000000000');
      }
    };

    img.onerror = () => {
      resolve('0000000000000000');
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}

/**
 * Calculates Hamming distance between two 16-character hex perceptual hashes.
 * Returns number of differing bits (0 to 64).
 */
export function calculateHammingDistance(hash1: string, hash2: string): number {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 64;

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    const n1 = parseInt(hash1[i], 16);
    const n2 = parseInt(hash2[i], 16);
    let xor = n1 ^ n2;
    // Count set bits in 4-bit nibble
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance;
}

/**
 * Calculates percentage similarity based on Hamming distance.
 * 0 distance = 100% similar.
 * 64 distance = 0% similar.
 */
export function getSimilarityPercentage(hash1: string, hash2: string): number {
  const dist = calculateHammingDistance(hash1, hash2);
  const similarity = Math.max(0, Math.round(((64 - dist) / 64) * 100));
  return similarity;
}

