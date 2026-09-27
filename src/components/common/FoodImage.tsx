import React, { useState } from 'react';
import { Utensils, Flame, Sparkles } from 'lucide-react';
import { DietType } from '../../types';

interface FoodImageProps {
  src: string;
  alt: string;
  diet?: DietType;
  category?: string;
  isSpicy?: boolean;
  isChefSpecial?: boolean;
  className?: string;
  aspectRatio?: '4/3' | '16/9' | 'square';
}

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  diet,
  isSpicy,
  isChefSpecial,
  className = '',
  aspectRatio = '4/3',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[4/3]';

  return (
    <div
      className={`relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${aspectClass} ${className}`}
    >
      {/* Skeleton Loading State */}
      {!isLoaded && !imageError && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
          <Utensils className="w-8 h-8 text-neutral-400 dark:text-neutral-600 animate-bounce" />
        </div>
      )}

      {/* Main Image */}
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Reliable Stylized Fallback Container */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-neutral-900 dark:to-neutral-800 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mb-2 text-amber-600 dark:text-amber-400">
            <Utensils className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 line-clamp-1">
            {alt}
          </span>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
            Uncle's Kitchen Special
          </span>
        </div>
      )}

      {/* Subtle bottom gradient overlay for readability & depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
        {diet && (
          <div
            className={`w-5 h-5 bg-white/95 dark:bg-neutral-900/95 rounded flex items-center justify-center shadow-sm backdrop-blur-xs border ${
              diet === 'veg'
                ? 'border-emerald-500'
                : diet === 'egg'
                ? 'border-amber-500'
                : 'border-red-600'
            }`}
            title={diet.toUpperCase()}
          >
            {diet === 'veg' && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            )}
            {diet === 'egg' && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            )}
            {diet === 'non-veg' && (
              <span
                className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-red-600"
              />
            )}
          </div>
        )}

        {isChefSpecial && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-xs">
            <Sparkles className="w-3 h-3" />
            <span>SPECIAL</span>
          </div>
        )}

        {isSpicy && (
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-xs">
            <Flame className="w-3 h-3" />
            <span>SPICY</span>
          </div>
        )}
      </div>
    </div>
  );
};
