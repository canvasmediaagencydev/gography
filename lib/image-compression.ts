import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;        // Target size in MB (default: 4MB)
  maxWidthOrHeight?: number; // Max dimension in pixels (default: 2048)
  useWebWorker?: boolean;    // Use web worker for compression (default: true)
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxSizeMB: 4,
  maxWidthOrHeight: 2048,
  useWebWorker: true,
};

/**
 * Compresses an image file if needed
 * - Skips compression for GIF files (animation not supported)
 * - Only compresses if file is larger than target size
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed file or original file if compression not needed
 */
export async function compressImage(
  file: File,
  options?: CompressionOptions
): Promise<File> {
  // Skip GIF files (animation compression not supported)
  if (file.type === 'image/gif') {
    return file;
  }

  // Only compress supported image types
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return file;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Skip compression if file is already smaller than target
  const targetBytes = opts.maxSizeMB * 1024 * 1024;
  if (file.size <= targetBytes) {
    return file;
  }

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: opts.maxSizeMB,
      maxWidthOrHeight: opts.maxWidthOrHeight,
      useWebWorker: opts.useWebWorker,
      fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
    });

    // Return compressed file with original name
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compresses multiple images in parallel
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @param onProgress - Optional callback for progress updates
 * @returns Array of compressed files
 */
export async function compressImages(
  files: File[],
  options?: CompressionOptions,
  onProgress?: (completed: number, total: number) => void
): Promise<File[]> {
  const total = files.length;
  let completed = 0;

  const compressedFiles = await Promise.all(
    files.map(async (file) => {
      const compressed = await compressImage(file, options);
      completed++;
      onProgress?.(completed, total);
      return compressed;
    })
  );

  return compressedFiles;
}

/**
 * Format bytes to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
