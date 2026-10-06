import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  Flame, 
  Sparkles, 
  Heart, 
  Info,
  Clock
} from 'lucide-react';
import { MenuItem, PortionType } from '../../types';
import { FoodImage } from '../common/FoodImage';
import { useRestaurant } from '../../context/RestaurantContext';

interface DishDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenCart,
}) => {
  const { cart, addToCart, updateQuantity } = useRestaurant();

  if (!isOpen || !item) return null;

  const [portion, setPortion] = useState<PortionType>(
    item.hasPortions && item.priceHalf ? 'half' : 'full'
  );
  const [spicePreference, setSpicePreference] = useState<string>('Medium (Default)');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const price = portion === 'half' && item.priceHalf ? item.priceHalf : item.priceFull;

  const quickCustomizationTags = [
    'Crisp fried noodles on side',
    'Extra garlic & scallions',
    'Less oil / light wok fry',
    'No Ajinomoto / MSG',
    'Extra gravy / sauce',
    'Serve extra hot',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddToCart = () => {
    if (!item.isAvailable) return;

    const notesParts = [];
    if (spicePreference !== 'Medium (Default)') {
      notesParts.push(`Spice: ${spicePreference}`);
    }
    if (selectedTags.length > 0) {
      notesParts.push(selectedTags.join(', '));
    }
    if (customNote.trim()) {
      notesParts.push(customNote.trim());
    }

    const specialInstructions = notesParts.length > 0 ? notesParts.join(' · ') : undefined;

    // Add with selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(item, portion, specialInstructions);
    }

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-3" />

        {/* Hero Image Showcase */}
        <div className="relative h-56 sm:h-64 w-full shrink-0">
          <FoodImage
            src={item.image}
            alt={item.name}
            diet={item.diet}
            category={item.category}
            isSpicy={item.isSpicy}
            isChefSpecial={item.isChefSpecial}
            aspectRatio="16/9"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-neutral-950/60 hover:bg-neutral-950/80 text-white backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <span>{item.category}</span>
              {item.isPopular && <span>· ★ Uncle's Favorite</span>}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Configuration Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {item.description}
          </p>

          {/* Portion Selector (Half vs Full) */}
          {item.hasPortions && item.priceHalf ? (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                Select Portion Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPortion('half')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    portion === 'half'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">Half Portion</p>
                    <p className="text-[10px] text-neutral-500">Serves 1 person</p>
                  </div>
                  <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400 tabular-nums">
                    ₹{item.priceHalf}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortion('full')}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    portion === 'full'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">Full Portion</p>
                    <p className="text-[10px] text-neutral-500">Serves 2-3 persons</p>
                  </div>
                  <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400 tabular-nums">
                    ₹{item.priceFull}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs">
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">Standard Portion</span>
              <span className="font-extrabold text-base text-amber-600 dark:text-amber-400 tabular-nums">
                ₹{item.priceFull}
              </span>
            </div>
          )}

          {/* Spice Level Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Spice Preference</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              {['Mild Spice', 'Medium (Default)', 'Extra Spicy 🔥'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpicePreference(s)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                    spicePreference === s
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Customization Chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Chef Instructions & Add-ons
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickCustomizationTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-semibold'
                        : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Note Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
              Additional Cooking Request (Optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Cut chicken into smaller bites, crispier noodles..."
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:border-amber-500 outline-hidden"
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-sm tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            disabled={!item.isAvailable}
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-md active:scale-98 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
            }`}
          >
            {isAdded ? (
              <span className="mx-auto flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Added to Plate!</span>
              </span>
            ) : (
              <>
                <span>Add to Plate</span>
                <span className="tabular-nums font-black text-sm">
                  ₹{price * quantity}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
