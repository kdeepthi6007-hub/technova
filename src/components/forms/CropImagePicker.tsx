// Crop Image Picker with Device File Upload (IndexedDB) & Web URL Preview

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Eye
} from 'lucide-react';
import { 
  validateCropImageFile, 
  validateCropImageUrl, 
  saveImageToIndexedDB,
  isIndexedDBImageKey,
  getImageFromIndexedDB
} from '../../utils/imageStorage';
import { CropImage } from '../common/CropImage';

interface CropImagePickerProps {
  value: string; // The URL or IndexedDB key
  onChange: (imageKeyOrUrl: string) => void;
  cropCategory?: string;
  cropName?: string;
}

export const CropImagePicker: React.FC<CropImagePickerProps> = ({
  value,
  onChange,
  cropCategory = 'Cereals & Grains',
  cropName = 'Crop Produce',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(isIndexedDBImageKey(value) ? '' : value);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [urlTestState, setUrlTestState] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external value when reset
  useEffect(() => {
    if (!isIndexedDBImageKey(value)) {
      setUrlInput(value || '');
    }
  }, [value]);

  // Handle local file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateCropImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      const imageKey = await saveImageToIndexedDB(file);
      onChange(imageKey);
      setSuccessMessage(`"${file.name}" uploaded successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setErrorMessage('Failed to save image locally. Please try again or use an image URL.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle URL input
  const handleUrlApply = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!urlInput.trim()) {
      onChange('');
      setUrlTestState('idle');
      return;
    }

    const validation = validateCropImageUrl(urlInput);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid URL.');
      setUrlTestState('invalid');
      return;
    }

    setUrlTestState('testing');
    // Test if image actually loads
    const testImg = new Image();
    testImg.src = urlInput.trim();
    testImg.onload = () => {
      setUrlTestState('valid');
      setSuccessMessage('Image URL verified and ready!');
      onChange(urlInput.trim());
    };
    testImg.onerror = () => {
      setUrlTestState('invalid');
      setErrorMessage('Warning: URL is reachable, but could not load as a direct image. The fallback illustration will be used unless you upload a direct photo.');
      onChange(urlInput.trim()); // Still assign so user can proceed if CORS blocks preview
    };
  };

  // Remove current image
  const handleRemoveImage = () => {
    onChange('');
    setUrlInput('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setUrlTestState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          Crop Photo (Upload or Web URL)
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove Photo</span>
          </button>
        )}
      </div>

      {/* Tabs for Option A vs Option B */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setActiveTab('upload');
            setErrorMessage(null);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-farm-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-farm-600" />
          <span>Upload from Device</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('url');
            setErrorMessage(null);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'url'
              ? 'bg-white text-farm-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-farm-600" />
          <span>Web Image URL</span>
        </button>
      </div>

      {/* TAB 1: File Upload (Option A) */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            id="crop-image-file-input"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-farm-600 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/60 hover:bg-farm-50/40 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 group-hover:text-farm-700 group-hover:border-farm-300 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-farm-800 transition-colors">
                {isUploading ? 'Saving photo to storage...' : 'Click to select crop image'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports JPG, JPEG, PNG, WebP (Max 5 MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Image URL (Option B) */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-farm-500/20"
            />
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-4 py-2 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              Apply URL
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Paste a direct HTTP or HTTPS image URL. If unreachable, the category illustration will be used.
          </p>
        </div>
      )}

      {/* Error and Success Notifications */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-start gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Live Preview Box */}
      <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-farm-600" />
            <span>Marketplace Card Preview:</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {value ? (isIndexedDBImageKey(value) ? 'Uploaded Device File' : 'External Web URL') : 'Default Category Illustration'}
          </span>
        </div>

        <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs">
          <CropImage
            src={value}
            alt={cropName}
            category={cropCategory}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
