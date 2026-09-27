import React from 'react';
import { Search, X, Flame } from 'lucide-react';
import { DietType, MainCategory } from '../../types';

interface MenuCategoryNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMainCategory: MainCategory;
  onSelectMainCategory: (cat: MainCategory) => void;
  selectedDiet: DietType | 'all';
  onSelectDiet: (diet: DietType | 'all') => void;
  spicyOnly: boolean;
  onToggleSpicyOnly: () => void;
  categoryCounts: Record<MainCategory, number>;
}

export const MenuCategoryNav: React.FC<MenuCategoryNavProps> = ({
  searchQuery,
  onSearchChange,
  selectedMainCategory,
  onSelectMainCategory,
  selectedDiet,
  onSelectDiet,
  spicyOnly,
  onToggleSpicyOnly,
  categoryCounts,
}) => {
  const mainCategories: MainCategory[] = ['All', 'Soups', 'Starters', 'Rice', 'Noodles'];

  return (
    <div className="sticky top-16 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md pb-3 pt-2 border-b border-neutral-200/80 dark:border-neutral-800/80 space-y-2.5 transition-colors">
      {/* Search Input Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Hakka noodles, Triple rice, Manchurian, Lollipop..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 rounded-xl border border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Spicy Filter Toggle */}
        <button
          onClick={onToggleSpicyOnly}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
            spicyOnly
              ? 'bg-red-500 text-white border-red-500 shadow-xs'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
          }`}
          title="Filter spicy dishes only"
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Spicy</span>
        </button>
      </div>

      {/* Main Categories & Diet Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Main Category Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {mainCategories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedMainCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectMainCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] tabular-nums ${
                    isSelected
                      ? 'text-neutral-300 dark:text-neutral-600'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Diet Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg self-start sm:self-auto shrink-0">
          <button
            onClick={() => onSelectDiet('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              selectedDiet === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            All
          </button>

          <button
            onClick={() => onSelectDiet('veg')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              selectedDiet === 'veg'
                ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Veg</span>
          </button>

          <button
            onClick={() => onSelectDiet('egg')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              selectedDiet === 'egg'
                ? 'bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Egg</span>
          </button>

          <button
            onClick={() => onSelectDiet('non-veg')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              selectedDiet === 'non-veg'
                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[7px] border-b-red-600" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>
    </div>
  );
};
