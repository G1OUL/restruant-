import React, { useState } from 'react';
import { Plus, Minus, Check, MessageSquare } from 'lucide-react';
import { MenuItem, PortionType } from '../../types';
import { FoodImage } from '../common/FoodImage';
import { useRestaurant } from '../../context/RestaurantContext';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { cart, addToCart, updateQuantity } = useRestaurant();

  // Selected portion state (defaults to 'full' or 'half')
  const [selectedPortion, setSelectedPortion] = useState<PortionType>(
    item.hasPortions && item.priceHalf ? 'half' : 'full'
  );

  // Special instructions modal or inline note
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [specialNote, setSpecialNote] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  // Check how many of the currently selected portion are in cart
  const currentCartKey = `${item.id}-${selectedPortion}-standard`;
  const cartItem = cart.find(
    (ci) => ci.menuItemId === item.id && ci.portion === selectedPortion && !ci.specialInstructions
  );
  const currentQty = cartItem ? cartItem.quantity : 0;

  const currentPrice =
    selectedPortion === 'half' && item.priceHalf ? item.priceHalf : item.priceFull;

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addToCart(item, selectedPortion, specialNote.trim() || undefined);
    setJustAdded(true);
    setShowNoteInput(false);
    setSpecialNote('');
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, 1);
    } else {
      handleAdd();
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, -1);
    }
  };

  return (
    <div
      className={`group flex flex-col justify-between bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border transition-all duration-300 ${
        !item.isAvailable
          ? 'opacity-60 border-neutral-200 dark:border-neutral-800'
          : 'border-neutral-200/90 dark:border-neutral-800 hover:border-amber-400/80 dark:hover:border-amber-500/60 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        {/* Visual Showcase Section */}
        <div className="relative">
          <FoodImage
            src={item.image}
            alt={item.name}
            diet={item.diet}
            category={item.category}
            isSpicy={item.isSpicy}
            isChefSpecial={item.isChefSpecial}
            aspectRatio="4/3"
          />

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1 rounded-md bg-red-600 text-white font-bold text-xs tracking-wider uppercase shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info & Content Section */}
        <div className="p-4 space-y-2">
          {/* Category Tag & Popular Marker */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            <span>{item.category}</span>
            {item.isPopular && (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                ★ Uncle's Favorite
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-50 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed min-h-[32px]">
            {item.description}
          </p>

          {/* Portion Selector (Half / Full) */}
          {item.hasPortions && item.priceHalf && (
            <div className="pt-1">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/90 rounded-xl">
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
          )}

          {/* Single Price Display (If no half portion) */}
          {!item.hasPortions && (
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 pt-1">
              <span>Standard Serving</span>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                ₹{item.priceFull}
              </span>
            </div>
          )}

          {/* Special Cooking Note Drawer Toggle */}
          {showNoteInput && (
            <div className="pt-2 animate-fadeIn">
              <input
                type="text"
                placeholder="e.g. Less spicy, no cabbage, extra crispy..."
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:border-amber-500 outline-hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <div className="flex items-center gap-2">
          {/* Note button */}
          <button
            type="button"
            onClick={() => setShowNoteInput(!showNoteInput)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              showNoteInput || specialNote
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Add special cooking request"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Stepper or Add to Cart Button */}
          {currentQty > 0 ? (
            <div className="flex-1 flex items-center justify-between bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl px-2 py-1.5 shadow-xs">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                title="Decrease Quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold tabular-nums leading-none">
                  {currentQty} in cart
                </span>
                <span className="text-[10px] text-amber-300 dark:text-amber-600 font-semibold tabular-nums">
                  ₹{currentPrice * currentQty}
                </span>
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                title="Increase Quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!item.isAvailable}
              onClick={handleAdd}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Order</span>
                  <span className="tabular-nums ml-1 font-extrabold">₹{currentPrice}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
