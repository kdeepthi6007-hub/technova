// IndexedDB Image Storage & Validation Utility for Farm2Pay AI
// Stores uploaded crop photos locally in IndexedDB to avoid localStorage quotas,
// ensuring images survive page refreshes and demo sessions without relying on temporary blob URLs.

const DB_NAME = 'farm2pay_db';
const DB_VERSION = 1;
const STORE_NAME = 'crop_images';

// In-memory object URL cache to avoid re-generating blobs continuously
const memoryUrlCache = new Map<string, string>();

/**
 * Open or create the IndexedDB database
 */
function openImageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open image database'));
  });
}

/**
 * Check if an image string is an IndexedDB reference key
 */
export function isIndexedDBImageKey(keyOrUrl: string): boolean {
  return typeof keyOrUrl === 'string' && keyOrUrl.startsWith('idb:');
}

/**
 * Validate image file type and size
 */
export function validateCropImageFile(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload JPG, JPEG, PNG, or WebP.',
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size too large (${sizeInMB} MB). Maximum allowed size is 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Validate direct image URL
 */
export function validateCropImageUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'Please enter a valid image web address.' };
  }

  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return { valid: false, error: 'URL must start with http:// or https://' };
  }

  try {
    const parsed = new URL(trimmed);
    if (!parsed.hostname || parsed.hostname.indexOf('.') === -1) {
      return { valid: false, error: 'Please enter a valid domain address (e.g. https://example.com/photo.jpg)' };
    }
  } catch {
    return { valid: false, error: 'Invalid URL format.' };
  }

  return { valid: true };
}

/**
 * Save an uploaded image file into IndexedDB and return its persistent reference key
 */
export async function saveImageToIndexedDB(file: File | Blob): Promise<string> {
  const db = await openImageDB();
  const id = `idb:img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Convert File/Blob to ArrayBuffer for robust IndexedDB cross-browser storage
  const arrayBuffer = await file.arrayBuffer();
  const mimeType = file.type || 'image/jpeg';

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      id,
      data: arrayBuffer,
      type: mimeType,
      createdAt: new Date().toISOString(),
    };

    const request = store.put(record);

    request.onsuccess = () => {
      // Create and cache an object URL for instant UI access
      const blob = new Blob([arrayBuffer], { type: mimeType });
      const objectUrl = URL.createObjectURL(blob);
      memoryUrlCache.set(id, objectUrl);
      resolve(id);
    };

    request.onerror = () => reject(request.error || new Error('Failed to save image to IndexedDB'));
  });
}

/**
 * Retrieve an image object URL from IndexedDB given its persistent reference key
 */
export async function getImageFromIndexedDB(id: string): Promise<string | null> {
  if (memoryUrlCache.has(id)) {
    return memoryUrlCache.get(id)!;
  }

  try {
    const db = await openImageDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (!result || !result.data) {
          resolve(null);
          return;
        }

        const blob = new Blob([result.data], { type: result.type || 'image/jpeg' });
        const objectUrl = URL.createObjectURL(blob);
        memoryUrlCache.set(id, objectUrl);
        resolve(objectUrl);
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Remove an image from IndexedDB
 */
export async function deleteImageFromIndexedDB(id: string): Promise<void> {
  if (memoryUrlCache.has(id)) {
    URL.revokeObjectURL(memoryUrlCache.get(id)!);
    memoryUrlCache.delete(id);
  }

  try {
    const db = await openImageDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch {
    // Ignore error
  }
}
