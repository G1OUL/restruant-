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
  Clock,
  Sparkles,
  CreditCard,
  Banknote,
  QrCode,
  Flame,
  Utensils
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { PortionType } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderTracker: () => void;
  onOpenTableModal?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenOrderTracker,
  onOpenTableModal,
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
    menu,
    addToCart,
  } = useRestaurant();

  const [orderNotes, setOrderNotes] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'upi' | 'cash'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<number | null>(null);

  if (!isOpen) return null;

  // Preset cooking instruction chips
  const noteSuggestions = [
    'Serve starters first',
    'Mild spicy',
    'Extra crispy',
    'Less oil',
    'No spring onions',
  ];

  const handleAddNoteChip = (chip: string) => {
    if (orderNotes.includes(chip)) return;
    setOrderNotes((prev) => (prev ? `${prev}, ${chip}` : chip));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const fullNote = [
        orderNotes.trim(),
        paymentPreference === 'upi' ? 'Payment: UPI QR at table' : 'Payment: Cash to waiter',
      ]
        .filter(Boolean)
        .join(' · ');

      const order = placeOrder(fullNote || undefined);
      setIsSubmitting(false);
      setOrderSuccessId(order.orderNumber);
    }, 450);
  };

  const handleViewTracker = () => {
    setOrderSuccessId(null);
    onClose();
    onOpenOrderTracker();
  };

  // Quick recommended add-ons
  const quickAddOns = [
    {
      id: 'addon-noodles',
      name: 'Crispy Fried Noodles',
      price: 30,
      description: 'Extra crispy bowl with sauce',
      image: menu.find((m) => m.name.toLowerCase().includes('bhel'))?.image || menu[0]?.image,
    },
    {
      id: 'addon-schezwan',
      name: 'Extra Schezwan Dip',
      price: 20,
      description: 'Spicy wok-tossed chutney',
      image: menu.find((m) => m.name.toLowerCase().includes('manchurian'))?.image || menu[1]?.image,
    },
  ];

  const handleAddQuickAddon = (addon: typeof quickAddOns[0]) => {
    // Find or create synthetic menu item for the add-on
    const syntheticItem = {
      id: addon.id,
      name: addon.name,
      category: 'Veg Starters' as const,
      diet: 'veg' as const,
      description: addon.description,
      hasPortions: false,
      priceFull: addon.price,
      isAvailable: true,
      image: addon.image,
    };
    addToCart(syntheticItem, 'full', 'Extra Add-on');
  };

  const threshold = 250;
  const progressToFreeCharge = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800">
          {/* Mobile Top Grab Bar */}
          <div className="sm:hidden w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-2" />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-neutral-900 dark:text-neutral-50 leading-tight">
                  Your Table Order
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {tableNumber.replace(/ \(.*\)/, '')}
                  </span>
                  {onOpenTableModal && (
                    <button
                      onClick={onOpenTableModal}
                      className="text-[11px] text-neutral-400 hover:text-amber-500 underline"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && !orderSuccessId && (
                <button
                  onClick={clearCart}
                  className="p-2 text-neutral-400 hover:text-red-500 text-xs font-medium rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Clear entire cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Order Success Screen */}
          {orderSuccessId ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Order Sent to Kitchen
                </span>
                <h3 className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
                  Ticket #{orderSuccessId}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto">
                  Chef at Uncle's Chinese has fired up the wok station for {tableNumber}.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/80 rounded-2xl text-xs text-neutral-600 dark:text-neutral-300 w-full space-y-2 text-left border border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between">
                  <span className="font-medium">Table Seating:</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">{tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Mode:</span>
                  <span className="font-bold capitalize">{paymentPreference === 'upi' ? 'UPI QR at Table' : 'Cash to Waiter'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estimated Cooking Time:</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">12 - 15 mins</span>
                </div>
              </div>

              <div className="w-full pt-4 space-y-2">
                <button
                  onClick={handleViewTracker}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Clock className="w-4 h-4" />
                  <span>Track Live Wok Status</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs transition-colors"
                >
                  Close & Add More Dishes
                </button>
              </div>
            </div>
          ) : (
            /* Items List & Checkout */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 dark:text-neutral-500 space-y-3 py-12">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                        Your plate is empty
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                        Explore our sizzler starters, Hakka noodles, triple rice, and soups to order!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Free Table Charge Progress Meter */}
                    <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-950 dark:text-amber-200">
                          {cartSubtotal >= threshold ? (
                            '🎉 Free Table Seating Unlocked!'
                          ) : (
                            <>Add <strong className="text-amber-700 dark:text-amber-300">₹{threshold - cartSubtotal}</strong> more for Free Seating</>
                          )}
                        </span>
                        <span className="text-[11px] font-semibold text-neutral-500">
                          Min ₹250
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                          style={{ width: `${progressToFreeCharge}%` }}
                        />
                      </div>
                      {cartSubtotal < threshold && (
                        <p className="text-[10px] text-neutral-500">
                          Uncle's Chinese policy: Orders under ₹250 add a small ₹20 table charge.
                        </p>
                      )}
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-2.5">
                      {cart.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-13 h-13 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                <span className="capitalize font-semibold text-amber-600 dark:text-amber-400">
                                  {item.portion} portion
                                </span>
                                <span>·</span>
                                <span className="tabular-nums font-semibold">
                                  ₹{item.price} each
                                </span>
                              </div>
                              {item.specialInstructions && (
                                <p className="text-[10px] text-neutral-400 italic truncate max-w-[190px] mt-0.5">
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

                            <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-0.5 shadow-2xs">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                title={item.quantity === 1 ? 'Remove from plate' : 'Decrease'}
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                ) : (
                                  <Minus className="w-3 h-3" />
                                )}
                              </button>
                              <span className="w-5 text-center text-xs font-bold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add-On items (Frequently added together) */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                        Frequently Added Extras
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {quickAddOns.map((addon) => (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => handleAddQuickAddon(addon)}
                            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 bg-neutral-50 dark:bg-neutral-800/50 text-left flex items-center justify-between gap-2 transition-all active:scale-95"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-[11px] text-neutral-900 dark:text-neutral-100 truncate">
                                {addon.name}
                              </p>
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold tabular-nums">
                                +₹{addon.price}
                              </p>
                            </div>
                            <div className="w-6 h-6 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0">
                              <Plus className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chef Cooking Instructions with chips */}
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                          <Utensils className="w-3.5 h-3.5 text-amber-500" />
                          <span>Special Kitchen Instructions</span>
                        </label>
                      </div>

                      {/* Quick preset chips */}
                      <div className="flex flex-wrap gap-1">
                        {noteSuggestions.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleAddNoteChip(chip)}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/15 hover:text-amber-600 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 transition-colors"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={2}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="e.g. Serve starters first, prepare with mild spices, extra crispy..."
                        className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="pt-2 space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                        Payment Method (Pay at Table)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentPreference('upi')}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                            paymentPreference === 'upi'
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-neutral-900 dark:text-neutral-100'
                              : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <div className="text-left">
                            <p>UPI / QR Scan</p>
                            <span className="text-[9px] font-normal text-neutral-500 block">GPay · PhonePe · Paytm</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentPreference('cash')}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                            paymentPreference === 'cash'
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-neutral-900 dark:text-neutral-100'
                              : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          <Banknote className="w-4 h-4 text-emerald-500" />
                          <div className="text-left">
                            <p>Cash to Staff</p>
                            <span className="text-[9px] font-normal text-neutral-500 block">Pay waiter at table</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bill Summary & Sticky Checkout CTA */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-3 shrink-0">
                  {/* Bill Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Dishes Subtotal</span>
                      <span className="tabular-nums font-semibold">₹{cartSubtotal}</span>
                    </div>

                    <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <span>Table Seating Fee</span>
                        <span
                          className="cursor-pointer text-neutral-400"
                          title="Policy: Orders below Rs 250 incur Rs 20 extra table fee"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </span>
                      </span>
                      {timePassCharge > 0 ? (
                        <span className="tabular-nums font-semibold text-amber-600">
                          +₹{timePassCharge}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-extrabold">
                          FREE (Waived)
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-sm font-extrabold text-neutral-900 dark:text-neutral-50">
                      <span>Total Payable</span>
                      <span className="tabular-nums text-lg text-amber-600 dark:text-amber-400 font-black">
                        ₹{cartTotal}
                      </span>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <button
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm flex items-center justify-between shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="mx-auto flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Sending Order to Wok Station...</span>
                      </span>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-black">
                            {cart.reduce((sum, i) => sum + i.quantity, 0)}
                          </span>
                          <span>Send Order to Kitchen</span>
                        </div>
                        <div className="flex items-center gap-1 font-black text-base">
                          <span className="tabular-nums">₹{cartTotal}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
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
