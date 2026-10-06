import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Bell, 
  Flame, 
  Menu as MenuIcon,
  X,
  Check
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MainCategory, DietType, MenuItem } from '../../types';
import { WelcomeBanner } from './WelcomeBanner';
import { MenuCategoryNav } from './MenuCategoryNav';
import { MenuItemCard } from './MenuItemCard';
import { DishDetailModal } from './DishDetailModal';

interface CustomerViewProps {
  onOpenCart: () => void;
  onOpenOrderTracker: () => void;
  onOpenTableModal: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
  onOpenStaffCall: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  onOpenCart,
  onOpenOrderTracker,
  onOpenTableModal,
  onOpenQRScanner,
  onOpenTableQRModal,
  onOpenStaffCall,
}) => {
  const { menu, cartCount, cartTotal, currentTableActiveAlert, tableNumber } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory>('All');
  const [selectedDiet, setSelectedDiet] = useState<DietType | 'all'>('all');
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [selectedDishForDetail, setSelectedDishForDetail] = useState<MenuItem | null>(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Compute counts per main category
  const categoryCounts = useMemo(() => {
    const counts: Record<MainCategory, number> = {
      All: menu.length,
      Soups: menu.filter((m) => m.category.includes('Soups')).length,
      Starters: menu.filter((m) => m.category.includes('Starters')).length,
      Rice: menu.filter((m) => m.category.includes('Rice')).length,
      Noodles: menu.filter((m) => m.category.includes('Noodles')).length,
    };
    return counts;
  }, [menu]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      // Main Category match
      if (selectedMainCategory !== 'All') {
        if (!item.category.includes(selectedMainCategory)) {
          return false;
        }
      }

      // Diet match
      if (selectedDiet !== 'all') {
        if (item.diet !== selectedDiet) {
          return false;
        }
      }

      // Spicy filter
      if (spicyOnly && !item.isSpicy) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [menu, selectedMainCategory, selectedDiet, spicyOnly, searchQuery]);

  // Group by category if viewing 'All' and no search
  const isViewingAll = selectedMainCategory === 'All' && !searchQuery.trim();

  const groupedCategories = useMemo(() => {
    if (!isViewingAll) return null;
    const cats: { title: string; icon: string; items: MenuItem[] }[] = [];
    const mainList: { cat: MainCategory; icon: string }[] = [
      { cat: 'Soups', icon: '🍲' },
      { cat: 'Starters', icon: '🥢' },
      { cat: 'Rice', icon: '🍚' },
      { cat: 'Noodles', icon: '🍜' },
    ];

    mainList.forEach(({ cat, icon }) => {
      const items = filteredItems.filter((i) => i.category.includes(cat));
      if (items.length > 0) {
        cats.push({ title: `${cat} Specialties`, icon, items });
      }
    });

    return cats;
  }, [filteredItems, isViewingAll]);

  return (
    <div className="pb-28 sm:pb-20 space-y-6">
      {/* Welcome & Table Service Hero */}
      <WelcomeBanner
        onOpenOrderTracker={onOpenOrderTracker}
        onOpenTableModal={onOpenTableModal}
        onOpenQRScanner={onOpenQRScanner}
        onOpenTableQRModal={onOpenTableQRModal}
        onOpenStaffCall={onOpenStaffCall}
      />

      {/* Filter and Search Navigation Bar */}
      <MenuCategoryNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMainCategory={selectedMainCategory}
        onSelectMainCategory={setSelectedMainCategory}
        selectedDiet={selectedDiet}
        onSelectDiet={setSelectedDiet}
        spicyOnly={spicyOnly}
        onToggleSpicyOnly={() => setSpicyOnly(!spicyOnly)}
        categoryCounts={categoryCounts}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-medium px-1">
        <span>
          Showing <strong className="text-neutral-900 dark:text-neutral-100">{filteredItems.length}</strong> authentic Chinese dishes
        </span>
        {(searchQuery || selectedMainCategory !== 'All' || selectedDiet !== 'all' || spicyOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMainCategory('All');
              setSelectedDiet('all');
              setSpicyOnly(false);
            }}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-neutral-100/70 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto" />
          <h3 className="text-base font-extrabold text-neutral-800 dark:text-neutral-200">
            No Chinese dishes matched your filters
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query, or clear the dietary and spice filters to view our full wok menu.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMainCategory('All');
              setSelectedDiet('all');
              setSpicyOnly(false);
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-extrabold text-xs shadow-xs"
          >
            Show All Dishes
          </button>
        </div>
      ) : groupedCategories ? (
        <div className="space-y-10">
          {groupedCategories.map((group) => (
            <section key={group.title} id={group.title.toLowerCase().replace(/\s+/g, '-')} className="space-y-3.5 scroll-mt-36">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{group.icon}</span>
                  <h2 className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                    {group.title}
                  </h2>
                  <span className="text-xs text-neutral-400 font-medium">({group.items.length})</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {group.items.map((dish) => (
                  <MenuItemCard 
                    key={dish.id} 
                    item={dish} 
                    onOpenDetail={(item) => setSelectedDishForDetail(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredItems.map((dish) => (
            <MenuItemCard 
              key={dish.id} 
              item={dish} 
              onOpenDetail={(item) => setSelectedDishForDetail(item)}
            />
          ))}
        </div>
      )}

      {/* Floating Menu Category Button (FAB) - Quick Jump for Mobile & Web */}
      <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-30">
        <button
          onClick={() => setIsCategoryDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-black text-xs shadow-2xl shadow-neutral-950/40 hover:scale-105 active:scale-95 transition-all ring-2 ring-amber-500/50"
        >
          <MenuIcon className="w-4 h-4 text-amber-500" />
          <span>MENU</span>
        </button>
      </div>

      {/* Floating Quick Cart Bottom Bar (Visible whenever items in cart) */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 inset-x-3 max-w-lg mx-auto z-30 animate-slideDown">
          <button
            onClick={onOpenCart}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-between shadow-2xl shadow-amber-500/30 active:scale-98 transition-all ring-2 ring-white/30 dark:ring-black/30"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-black">
                {cartCount}
              </span>
              <span>Review Order · {tableNumber.replace(/ \(.*\)/, '')}</span>
            </div>
            <div className="flex items-center gap-2 font-black text-base">
              <span className="tabular-nums">₹{cartTotal}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Category Quick Drawer Modal (When MENU button tapped) */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsCategoryDrawerOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-5 z-10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-black text-base text-neutral-900 dark:text-neutral-50">
                Menu Sections
              </h3>
              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'All' as MainCategory, label: 'All Dishes', icon: '🥢' },
                { id: 'Soups' as MainCategory, label: 'Soups', icon: '🍲' },
                { id: 'Starters' as MainCategory, label: 'Starters', icon: '🔥' },
                { id: 'Rice' as MainCategory, label: 'Rice Specialties', icon: '🍚' },
                { id: 'Noodles' as MainCategory, label: 'Hakka & Schezwan Noodles', icon: '🍜' },
              ].map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isSelected = selectedMainCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedMainCategory(cat.id);
                      setIsCategoryDrawerOpen(false);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className="tabular-nums opacity-75">
                      {count} items
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dish Detail & Customization Modal */}
      <DishDetailModal
        item={selectedDishForDetail}
        isOpen={!!selectedDishForDetail}
        onClose={() => setSelectedDishForDetail(null)}
        onOpenCart={onOpenCart}
      />
    </div>
  );
};
