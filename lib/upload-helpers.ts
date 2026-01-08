/**
 * Upload file with progress tracking using XMLHttpRequest
 * @param url - API endpoint
 * @param formData - FormData containing the file and other data
 * @param onProgress - Callback function that receives progress (0-100)
 * @returns Promise with response data
 */
export function uploadWithProgress<T = unknown>(
  url: string,
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch {
          reject(new Error("Invalid JSON response"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.error || `HTTP Error ${xhr.status}`));
        } catch {
          reject(new Error(`HTTP Error ${xhr.status}`));
        }
      }
    });

    // Handle network errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error occurred"));
    });

    // Handle abort
    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    // Send request
    xhr.open("POST", url);
    xhr.send(formData);
  });
}

/**
 * Upload multiple files sequentially with progress tracking
 * @param files - Array of files with their data
 * @param uploadFn - Function to upload a single file
 * @param onProgress - Callback for overall progress
 * @param onFileProgress - Callback for individual file progress
 */
export async function uploadMultipleFiles<T>(
  files: Array<{ formData: FormData; url: string }>,
  onProgress?: (
    overallProgress: number,
    currentIndex: number,
    total: number
  ) => void,
  onFileProgress?: (fileProgress: number, fileIndex: number) => void
): Promise<T[]> {
  const results: T[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const { url, formData } = files[i];

    try {
      const result = await uploadWithProgress<T>(
        url,
        formData,
        (fileProgress) => {
          if (onFileProgress) {
            onFileProgress(fileProgress, i);
          }

          // Calculate overall progress
          if (onProgress) {
            const completedFiles = i;
            const currentFileProgress = fileProgress / 100;
            const overallProgress =
              ((completedFiles + currentFileProgress) / total) * 100;
            onProgress(overallProgress, i + 1, total);
          }
        }
      );
      results.push(result);
    } catch (error) {
      throw error;
    }
  }

  return results;
}
