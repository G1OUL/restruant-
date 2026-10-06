import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  ShoppingBag, 
  Bell, 
  QrCode, 
  UtensilsCrossed, 
  ChefHat, 
  UserCheck,
  Receipt
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenTableModal: () => void;
  onOpenOrderTracker: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
  onOpenStaffCall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenTableModal,
  onOpenOrderTracker,
  onOpenQRScanner,
  onOpenTableQRModal,
  onOpenStaffCall,
}) => {
  const {
    isDarkMode,
    toggleTheme,
    tableNumber,
    currentRole,
    setCurrentRole,
    cartCount,
    cartTotal,
    serviceAlerts,
    orders,
    currentTableActiveAlert,
  } = useRestaurant();

  // Unresolved alerts for waiter
  const pendingAlertsCount = serviceAlerts.filter((a) => !a.isResolved).length;
  // Pending orders for kitchen
  const pendingKitchenOrders = orders.filter(
    (o) => o.status === 'received' || o.status === 'preparing'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Top Banner if Active Staff Alert is Pending for current table */}
      {currentRole === 'customer' && currentTableActiveAlert && (
        <div 
          onClick={onOpenStaffCall}
          className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-3 py-1.5 text-center text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-neutral-950 animate-ping" />
          <span>Staff requested: {currentTableActiveAlert.message} · Tap to view or cancel</span>
        </div>
      )}

      {/* Main Top Header - 3-Zone Architecture */}
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 shadow-xs font-bold shrink-0">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                Uncle's Chinese
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hidden xs:inline">
                अंकल्स
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-medium leading-tight">
              Contactless Table Ordering & KOT
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Staff Console Switcher */}
        <nav 
          aria-label="Role Switcher"
          className="hidden md:flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-bold"
        >
          <button
            onClick={() => setCurrentRole('customer')}
            className={`py-1.5 px-3 rounded-lg transition-all ${
              currentRole === 'customer'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Dining Menu
          </button>

          <button
            onClick={() => setCurrentRole('waiter')}
            className={`py-1.5 px-3 flex items-center gap-1.5 rounded-lg transition-all ${
              currentRole === 'waiter'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Waiter</span>
            {pendingAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-500 text-white animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentRole('kitchen')}
            className={`py-1.5 px-3 flex items-center gap-1.5 rounded-lg transition-all ${
              currentRole === 'kitchen'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen KOT</span>
            {pendingKitchenOrders > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-neutral-950 font-mono">
                {pendingKitchenOrders}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Table chip, Call Staff, Cart, Theme) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Table Seating Chip */}
          {currentRole === 'customer' ? (
            <button
              onClick={onOpenTableModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all active:scale-95"
              title="Current Seated Table - Tap to change or view QR stand"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate max-w-[90px] sm:max-w-none">
                {tableNumber.replace(/ \(.*\)/, '')}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenTableQRModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs">QR Stands</span>
            </button>
          )}

          {/* Call Staff Button (Customer Mode) */}
          {currentRole === 'customer' && (
            <button
              onClick={onOpenStaffCall}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 shadow-2xs ${
                currentTableActiveAlert
                  ? 'bg-amber-500 text-neutral-950 animate-pulse'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              title="Call Staff, request water, bill or assistance"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Call Staff</span>
            </button>
          )}

          {/* Cart Trigger Button (Customer Mode) */}
          {currentRole === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-sm active:scale-95 transition-all"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 ? (
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="tabular-nums font-black hidden sm:inline">
                    ₹{cartTotal}
                  </span>
                </div>
              ) : (
                <span className="hidden sm:inline">Cart</span>
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors active:scale-95"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher (Shown on mobile viewports) */}
      <div className="md:hidden px-3 pb-2 pt-0.5">
        <nav 
          aria-label="Mobile Staff Modes"
          className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-bold"
        >
          <button
            onClick={() => setCurrentRole('customer')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
              currentRole === 'customer'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setCurrentRole('waiter')}
            className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-lg transition-all ${
              currentRole === 'waiter'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Waiter</span>
            {pendingAlertsCount > 0 && (
              <span className="px-1 py-0.2 rounded-full text-[9px] font-black bg-red-500 text-white">
                {pendingAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentRole('kitchen')}
            className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-lg transition-all ${
              currentRole === 'kitchen'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            <ChefHat className="w-3 h-3" />
            <span>Kitchen</span>
            {pendingKitchenOrders > 0 && (
              <span className="px-1 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-neutral-950 font-mono">
                {pendingKitchenOrders}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
