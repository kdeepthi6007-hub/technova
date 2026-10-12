// Reusable Crop Image Component with IndexedDB Resolution, Loading States & Elegant Fallbacks

import React, { useState, useEffect } from 'react';
import { 
  Wheat, 
  Sprout, 
  Flame, 
  Leaf, 
  Apple, 
  Carrot, 
  ImageOff,
  Sparkles
} from 'lucide-react';
import { getImageFromIndexedDB, isIndexedDBImageKey } from '../../utils/imageStorage';

interface CropImageProps {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  containerClassName?: string;
}

export const CropImage: React.FC<CropImageProps> = ({
  src,
  alt,
  category = 'Cereals & Grains',
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full relative overflow-hidden bg-slate-100',
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    if (!src || typeof src !== 'string' || !src.trim()) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const trimmed = src.trim();

    // Check if image is stored in IndexedDB
    if (isIndexedDBImageKey(trimmed)) {
      getImageFromIndexedDB(trimmed).then((objectUrl) => {
        if (!isMounted) return;
        if (objectUrl) {
          setResolvedSrc(objectUrl);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      }).catch(() => {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      });
    } else {
      setResolvedSrc(trimmed);
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  // Pick category icon & styling for fallback
  const getCategoryFallback = () => {
    switch (category) {
      case 'Pulses':
        return {
          icon: Leaf,
          gradient: 'from-amber-600/90 to-emerald-800/90',
          label: 'Pulses & Legumes',
        };
      case 'Oilseeds':
        return {
          icon: Flame,
          gradient: 'from-amber-500/90 to-yellow-700/90',
          label: 'Oilseeds & Groundnut',
        };
      case 'Spices':
        return {
          icon: Sparkles,
          gradient: 'from-red-600/90 to-amber-700/90',
          label: 'Spices & Condiments',
        };
      case 'Vegetables':
        return {
          icon: Carrot,
          gradient: 'from-emerald-600/90 to-teal-800/90',
          label: 'Fresh Farm Produce',
        };
      case 'Fruits':
        return {
          icon: Apple,
          gradient: 'from-rose-600/90 to-red-800/90',
          label: 'Orchard Fruit',
        };
      case 'Cash Crops':
        return {
          icon: Sprout,
          gradient: 'from-green-700/90 to-farm-900/90',
          label: 'Commercial Cash Crop',
        };
      case 'Cereals & Grains':
      default:
        return {
          icon: Wheat,
          gradient: 'from-emerald-700/90 to-farm-900/90',
          label: 'Cereals & Paddy',
        };
    }
  };

  const fallback = getCategoryFallback();
  const FallbackIcon = fallback.icon;

  return (
    <div className={containerClassName}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <Wheat className="w-8 h-8 text-slate-400 opacity-40 animate-bounce" />
        </div>
      )}

      {/* Actual Image */}
      {resolvedSrc && !hasError && (
        <img
          src={resolvedSrc}
          alt={alt || 'Crop produce'}
          className={`${className} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          loading="lazy"
        />
      )}

      {/* Graceful Fallback Illustration when Image fails or is not available */}
      {hasError && (
        <div className={`w-full h-full bg-gradient-to-tr ${fallback.gradient} text-white p-5 flex flex-col justify-between items-center text-center select-none relative overflow-hidden`}>
          {/* Subtle background SVG motif */}
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
            <FallbackIcon className="w-36 h-36" />
          </div>

          <div className="w-full flex items-center justify-between text-[10px] font-bold tracking-wider uppercase opacity-85">
            <span>{category}</span>
            <span className="flex items-center gap-1">
              <ImageOff className="w-3 h-3" />
              <span>Produce Lot</span>
            </span>
          </div>

          <div className="my-auto py-2 flex flex-col items-center">
            <div className="p-3 bg-white/15 backdrop-blur-xs rounded-2xl mb-2 shadow-inner">
              <FallbackIcon className="w-8 h-8 text-emerald-100" />
            </div>
            <h4 className="text-sm font-extrabold tracking-tight line-clamp-1 max-w-[200px] text-white drop-shadow-xs">
              {alt || 'Agricultural Produce'}
            </h4>
            <span className="text-[11px] font-medium text-emerald-100/90 mt-0.5">
              Verified Farmer Lot
            </span>
          </div>

          <div className="text-[10px] font-semibold text-white/80 bg-black/20 px-2.5 py-0.5 rounded-full">
            {fallback.label}
          </div>
        </div>
      )}
    </div>
  );
};
