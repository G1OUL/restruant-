import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { PortionType } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderTracker: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenOrderTracker,
}) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    timePassCharge,
    cartTotal,
    tableNumber,
    placeOrder,
  } = useRestaurant();

  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(orderNotes.trim() || undefined);
      setIsSubmitting(false);
      setOrderSuccessId(order.orderNumber);
    }, 400);
  };

  const handleViewTracker = () => {
    setOrderSuccessId(null);
    onClose();
    onOpenOrderTracker();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-neutral-900 dark:text-neutral-50">
                  Your Table Order
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {tableNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && !orderSuccessId && (
                <button
                  onClick={clearCart}
                  className="p-2 text-neutral-400 hover:text-red-500 text-xs font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Clear entire cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Success Screen */}
          {orderSuccessId ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Order Successfully Sent!
                </span>
                <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                  Order #{orderSuccessId}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto">
                  The kitchen at Uncle's Chinese has received your order and started wok preparation.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/80 rounded-xl text-xs text-neutral-600 dark:text-neutral-300 w-full space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">Table:</span>
                  <span className="font-bold">{tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estimated Time:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">12 - 15 mins</span>
                </div>
              </div>

              <div className="w-full pt-4 space-y-2">
                <button
                  onClick={handleViewTracker}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>Track Live Order Status</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold text-xs transition-colors"
                >
                  Close & Order More Items
                </button>
              </div>
            </div>
          ) : (
            /* Items List & Checkout */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 dark:text-neutral-500 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-neutral-700 dark:text-neutral-300">
                        Your plate is empty
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Explore our Hakka noodles, sizzling starters, and savory soups to begin!
                      </p>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                            <span className="capitalize font-semibold text-amber-600 dark:text-amber-400">
                              {item.portion}
                            </span>
                            <span>·</span>
                            <span className="tabular-nums font-semibold">
                              ₹{item.price} each
                            </span>
                          </div>
                          {item.specialInstructions && (
                            <p className="text-[10px] text-neutral-400 italic truncate max-w-[170px]">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stepper & Price */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          ₹{item.price * item.quantity}
                        </span>

                        <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {cart.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Chef Cooking Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Please serve starters first, prepare with mild spices, extra green chili dip..."
                      className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:border-amber-500 outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Bill Summary & Place Order CTA */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-3">
                  {/* Bill Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Subtotal</span>
                      <span className="tabular-nums font-semibold">₹{cartSubtotal}</span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <span>Time Pass Charge</span>
                        <span
                          className="cursor-pointer text-neutral-400"
                          title="Orders below Rs 250 incur Rs 20 extra table charge as per Uncle's Chinese policy"
                        >
                          <Info className="w-3 h-3" />
                        </span>
                      </span>
                      {timePassCharge > 0 ? (
                        <span className="tabular-nums font-semibold text-amber-600">
                          +₹{timePassCharge}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold">
                          FREE (Order ₹250+)
                        </span>
                      )}
                    </div>

                    {cartSubtotal < 250 && (
                      <p className="text-[10px] text-amber-700 dark:text-amber-400/80">
                        Tip: Add ₹{250 - cartSubtotal} more to waive the ₹20 charge!
                      </p>
                    )}

                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-sm font-extrabold text-neutral-900 dark:text-neutral-50">
                      <span>Total Payable</span>
                      <span className="tabular-nums text-base text-amber-600 dark:text-amber-400">
                        ₹{cartTotal}
                      </span>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <button
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending to Wok Station...</span>
                    ) : (
                      <>
                        <span>Place Order · ₹{cartTotal}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
