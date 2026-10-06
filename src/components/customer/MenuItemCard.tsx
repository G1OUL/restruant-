import React, { useState } from 'react';
import { Plus, Minus, Check, MessageSquare, SlidersHorizontal, Flame } from 'lucide-react';
import { MenuItem, PortionType } from '../../types';
import { FoodImage } from '../common/FoodImage';
import { useRestaurant } from '../../context/RestaurantContext';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenDetail?: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onOpenDetail }) => {
  const { cart, addToCart, updateQuantity } = useRestaurant();

  // Selected portion state (defaults to 'half' if available, otherwise 'full')
  const [selectedPortion, setSelectedPortion] = useState<PortionType>(
    item.hasPortions && item.priceHalf ? 'half' : 'full'
  );

  const [justAdded, setJustAdded] = useState(false);

  // Find standard cart item for selected portion
  const cartItem = cart.find(
    (ci) => ci.menuItemId === item.id && ci.portion === selectedPortion && !ci.specialInstructions
  );
  // Total quantity across all variants of this dish
  const totalItemQty = cart
    .filter((ci) => ci.menuItemId === item.id)
    .reduce((sum, ci) => sum + ci.quantity, 0);

  const currentQty = cartItem ? cartItem.quantity : 0;

  const currentPrice =
    selectedPortion === 'half' && item.priceHalf ? item.priceHalf : item.priceFull;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    addToCart(item, selectedPortion);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, 1);
    } else {
      handleAdd(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, -1);
    }
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(item);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group cursor-pointer flex flex-col justify-between bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${
        !item.isAvailable
          ? 'opacity-60 border-neutral-200 dark:border-neutral-800'
          : 'border-neutral-200/90 dark:border-neutral-800/90 hover:border-amber-400 dark:hover:border-amber-500/70'
      }`}
    >
      <div>
        {/* Visual Showcase Section */}
        <div className="relative aspect-4/3 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <FoodImage
            src={item.image}
            alt={item.name}
            diet={item.diet}
            category={item.category}
            isSpicy={item.isSpicy}
            isChefSpecial={item.isChefSpecial}
            aspectRatio="4/3"
          />

          {/* Sold out overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1 rounded-xl bg-red-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md">
                Sold Out
              </span>
            </div>
          )}

          {/* Popular Tag */}
          {item.isPopular && (
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-xs text-amber-300 font-bold text-[10px] tracking-tight flex items-center gap-1 shadow-xs">
              <span>★</span>
              <span>Chef's Choice</span>
            </div>
          )}

          {/* Customize quick indicator */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/80 backdrop-blur-xs text-neutral-200 px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-amber-400" />
            <span>Customize</span>
          </div>
        </div>

        {/* Info & Content Section */}
        <div className="p-4 space-y-2">
          {/* Category & Diet indicator */}
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-medium text-[11px] truncate">{item.category}</span>
            {item.isSpicy && (
              <span className="flex items-center gap-0.5 text-red-500 text-[11px] font-semibold">
                <Flame className="w-3 h-3 shrink-0" />
                <span>Spicy</span>
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-50 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed min-h-[32px]">
            {item.description}
          </p>

          {/* Portion Selector Buttons (Half / Full) */}
          {item.hasPortions && item.priceHalf ? (
            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-2 gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800/90 rounded-xl">
                <button
                  type="button"
                  disabled={!item.isAvailable}
                  onClick={() => setSelectedPortion('half')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedPortion === 'half'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <span>Half</span>
                  <span className="tabular-nums font-bold text-amber-600 dark:text-amber-400">
                    ₹{item.priceHalf}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={!item.isAvailable}
                  onClick={() => setSelectedPortion('full')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedPortion === 'full'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <span>Full</span>
                  <span className="tabular-nums font-bold text-amber-600 dark:text-amber-400">
                    ₹{item.priceFull}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 pt-1">
              <span>Standard Serving</span>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                ₹{item.priceFull}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          {/* Quick Customize Button */}
          {onOpenDetail && (
            <button
              type="button"
              onClick={() => onOpenDetail(item)}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400 transition-colors"
              title="Customize spice level and cooking notes"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Stepper or Add to Cart Button */}
          {currentQty > 0 ? (
            <div className="flex-1 flex items-center justify-between bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-950 rounded-2xl px-2 py-1 shadow-sm">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                title="Decrease"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-xs font-black tabular-nums">
                  {currentQty} in plate
                </span>
                <span className="text-[10px] text-amber-400 dark:text-amber-700 font-extrabold tabular-nums">
                  ₹{currentPrice * currentQty}
                </span>
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                title="Increase"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!item.isAvailable}
              onClick={handleAdd}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-between transition-all active:scale-95 shadow-sm ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
              }`}
            >
              {justAdded ? (
                <span className="mx-auto flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    <span>ADD</span>
                  </span>
                  <span className="tabular-nums font-black text-xs sm:text-sm">
                    ₹{currentPrice}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
