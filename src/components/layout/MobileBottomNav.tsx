import React from 'react';
import { 
  UtensilsCrossed, 
  Bell, 
  Camera, 
  Receipt, 
  ShoppingBag, 
  Check 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface MobileBottomNavProps {
  onOpenCart: () => void;
  onOpenOrderTracker: () => void;
  onOpenQRScanner: () => void;
  onOpenTableModal: () => void;
  onOpenStaffCall: () => void;
  onScrollToMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCart,
  onOpenOrderTracker,
  onOpenQRScanner,
  onOpenStaffCall,
  onScrollToMenu,
}) => {
  const { 
    cartCount, 
    cartTotal, 
    latestCurrentTableOrder, 
    currentTableActiveAlert,
  } = useRestaurant();

  const hasActiveOrder =
    latestCurrentTableOrder &&
    latestCurrentTableOrder.status !== 'completed' &&
    latestCurrentTableOrder.status !== 'cancelled';

  const handleMenuClick = () => {
    if (onScrollToMenu) {
      onScrollToMenu();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="sticky bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 px-3 py-1.5 transition-colors shadow-xl"
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {/* Menu Tab */}
        <button
          onClick={handleMenuClick}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-neutral-600 dark:text-neutral-400 hover:text-amber-500 active:scale-95 transition-all min-h-[44px] min-w-[48px]"
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">Menu</span>
        </button>

        {/* Call Staff Tab (Opens StaffCallModal) */}
        <button
          onClick={onOpenStaffCall}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl active:scale-95 transition-all min-h-[44px] min-w-[48px] ${
            currentTableActiveAlert
              ? 'text-amber-500 font-extrabold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-amber-500'
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 mb-0.5 ${currentTableActiveAlert ? 'animate-bounce text-amber-500' : ''}`} />
            {currentTableActiveAlert && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">
            {currentTableActiveAlert ? 'Staff Called' : 'Call Staff'}
          </span>
        </button>

        {/* Center Primary Action: Scan Table QR */}
        <button
          onClick={onOpenQRScanner}
          className="relative -top-3 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-linear-to-tr from-amber-600 to-amber-400 text-neutral-950 shadow-xl shadow-amber-500/35 ring-4 ring-white dark:ring-neutral-900 active:scale-90 transition-transform"
          title="Scan Table QR Code"
        >
          <Camera className="w-5 h-5" />
          <span className="sr-only">Scan Table QR</span>
        </button>

        {/* Orders Tracker Tab */}
        <button
          onClick={onOpenOrderTracker}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-neutral-600 dark:text-neutral-400 hover:text-amber-500 active:scale-95 transition-all min-h-[44px] min-w-[48px]"
        >
          <div className="relative">
            <Receipt className="w-5 h-5 mb-0.5" />
            {hasActiveOrder && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            )}
            {hasActiveOrder && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">
            {hasActiveOrder ? `#${latestCurrentTableOrder.orderNumber}` : 'Status'}
          </span>
        </button>

        {/* Cart Tab with Count Badge & Total */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-neutral-900 dark:text-neutral-100 hover:text-amber-500 active:scale-95 transition-all min-h-[44px] min-w-[48px]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-amber-500" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tabular-nums tracking-tight">
            {cartCount > 0 ? `₹${cartTotal}` : 'Plate'}
          </span>
        </button>
      </div>
    </nav>
  );
};
