import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  ShoppingBag, 
  Bell, 
  Receipt, 
  QrCode, 
  UtensilsCrossed, 
  ChefHat, 
  UserCheck,
  Camera,
  Layers
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenTableModal: () => void;
  onOpenOrderTracker: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenTableModal,
  onOpenOrderTracker,
  onOpenQRScanner,
  onOpenTableQRModal,
}) => {
  const {
    isDarkMode,
    toggleTheme,
    tableNumber,
    currentRole,
    setCurrentRole,
    cartCount,
    serviceAlerts,
    orders,
    currentTableOrders,
    sendServiceAlert,
    currentTableActiveAlert,
  } = useRestaurant();

  const [callFeedback, setCallFeedback] = useState<string | null>(null);

  // Unresolved alerts for waiter
  const pendingAlertsCount = serviceAlerts.filter((a) => !a.isResolved).length;
  // Pending orders for kitchen
  const pendingKitchenOrders = orders.filter(
    (o) => o.status === 'received' || o.status === 'preparing'
  ).length;

  const handleCallWaiter = () => {
    sendServiceAlert('call_waiter', 'Customer requested assistance at table');
    setCallFeedback('Waiter has been notified!');
    setTimeout(() => setCallFeedback(null), 3500);
  };

  const activeTableOrder = currentTableOrders.find(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Toast Alert Feedback Bar */}
      {callFeedback && (
        <div className="bg-amber-500 text-neutral-950 px-3 py-1.5 text-center text-xs font-semibold animate-pulse flex items-center justify-center gap-1.5">
          <Bell className="w-3.5 h-3.5 shrink-0" />
          <span>{callFeedback} Staff is on the way!</span>
        </div>
      )}

      {/* Main Top Header */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 shadow-xs font-bold shrink-0">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                Uncle's Chinese
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium">
                अंकल्स
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium leading-tight">
              India's Chinese · Veg & Non-Veg
            </p>
          </div>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Table Chip (Customer) */}
          {currentRole === 'customer' ? (
            <button
              onClick={onOpenTableModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all active:scale-95"
              title="Current Seated Table - Tap to change or view QR stand"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span>{tableNumber.replace(/ \(.*\)/, '')}</span>
            </button>
          ) : (
            <button
              onClick={onOpenTableQRModal}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="View Table QRs & Stands"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px]">QR Stands</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors active:scale-95"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Role Segmented Tabs (Customer / Waiter / Kitchen) */}
      <div className="px-3 pb-2 pt-0.5">
        <nav 
          aria-label="Staff and Dining Mode Switcher" 
          className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800/90 rounded-xl text-xs font-semibold"
        >
          <button
            onClick={() => setCurrentRole('customer')}
            className={`flex-1 py-1 px-2 text-center rounded-lg transition-all ${
              currentRole === 'customer'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Dining Menu
          </button>

          <button
            onClick={() => setCurrentRole('waiter')}
            className={`flex-1 py-1 px-2 flex items-center justify-center gap-1 rounded-lg transition-all ${
              currentRole === 'waiter'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Waiter</span>
            {pendingAlertsCount > 0 && (
              <span className="px-1 py-0.2 rounded-full text-[9px] font-bold bg-red-500 text-white animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentRole('kitchen')}
            className={`flex-1 py-1 px-2 flex items-center justify-center gap-1 rounded-lg transition-all ${
              currentRole === 'kitchen'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <ChefHat className="w-3 h-3" />
            <span>Kitchen</span>
            {pendingKitchenOrders > 0 && (
              <span className="px-1 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-neutral-950 font-mono">
                {pendingKitchenOrders}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
