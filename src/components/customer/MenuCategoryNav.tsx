import React from 'react';
import { Search, X, Flame, Sparkles } from 'lucide-react';
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
  const mainCategories: { id: MainCategory; label: string; icon: string }[] = [
    { id: 'All', label: 'All Dishes', icon: '🥢' },
    { id: 'Soups', label: 'Soups', icon: '🍲' },
    { id: 'Starters', label: 'Starters', icon: '🔥' },
    { id: 'Rice', label: 'Rice', icon: '🍚' },
    { id: 'Noodles', label: 'Noodles', icon: '🍜' },
  ];

  return (
    <div className="sticky top-14 sm:top-16 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md pb-3 pt-2 border-b border-neutral-200/80 dark:border-neutral-800/80 space-y-3 transition-colors">
      {/* Search Input Row with Spicy Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Hakka noodles, Triple rice, Manchurian, Lollipop..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 rounded-2xl border border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Spicy Filter Toggle Button */}
        <button
          onClick={onToggleSpicyOnly}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold shrink-0 border transition-all active:scale-95 shadow-2xs ${
            spicyOnly
              ? 'bg-red-500 text-white border-red-500 shadow-sm'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
          }`}
          title="Filter spicy dishes only"
        >
          <Flame className="w-4 h-4" />
          <span className="hidden sm:inline">Spicy Only</span>
        </button>
      </div>

      {/* Main Categories Scroller & Diet Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Horizontal Category Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {mainCategories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedMainCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectMainCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-950 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] tabular-nums font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Diet Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl self-start sm:self-auto shrink-0 shadow-2xs">
          <button
            onClick={() => onSelectDiet('all')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedDiet === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            All
          </button>

          <button
            onClick={() => onSelectDiet('veg')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedDiet === 'veg'
                ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Veg</span>
          </button>

          <button
            onClick={() => onSelectDiet('egg')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedDiet === 'egg'
                ? 'bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Egg</span>
          </button>

          <button
            onClick={() => onSelectDiet('non-veg')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedDiet === 'non-veg'
                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
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
