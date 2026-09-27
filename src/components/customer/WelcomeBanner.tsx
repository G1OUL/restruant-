import React, { useState } from 'react';
import { 
  Bell, 
  Receipt, 
  Droplet, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  Clock,
  Camera,
  QrCode
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { RESTAURANT_INFO } from '../../data/restaurantData';
import { ASSET_IMAGES } from '../../data/foodAssets';

interface WelcomeBannerProps {
  onOpenOrderTracker: () => void;
  onOpenTableModal: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onOpenOrderTracker,
  onOpenTableModal,
  onOpenQRScanner,
  onOpenTableQRModal,
}) => {
  const {
    tableNumber,
    sendServiceAlert,
    currentTableActiveAlert,
    latestCurrentTableOrder,
  } = useRestaurant();

  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  const triggerAlert = (type: 'call_waiter' | 'request_bill' | 'water', label: string) => {
    sendServiceAlert(type);
    setServiceMessage(`${label} sent to staff!`);
    setTimeout(() => setServiceMessage(null), 4000);
  };

  const hasActiveOrder =
    latestCurrentTableOrder &&
    latestCurrentTableOrder.status !== 'completed' &&
    latestCurrentTableOrder.status !== 'cancelled';

  return (
    <div className="w-full mb-6">
      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white shadow-xl border border-neutral-800">
        {/* Background Food Photography with Rich Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={ASSET_IMAGES.hero}
            alt="Uncle's Chinese Special Feast"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            {/* Table Badge and Restaurant Title */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenTableModal}
                className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{tableNumber}</span>
                <span className="text-[10px] text-amber-200/70">· Change</span>
              </button>

              <button
                onClick={onOpenQRScanner}
                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>

              <button
                onClick={onOpenTableQRModal}
                className="px-2.5 py-1 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700 text-xs font-medium transition-colors flex items-center gap-1"
                title="View physical table acrylic QR stand"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Table Stand QR</span>
              </button>

              <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Fresh Wok Preparation</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Authentic Indian Chinese Cuisine
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Order directly from your seat with our table QR code. Every dish is wok-prepared live with fragrant garlic, crisp vegetables, and handcrafted sauces.
            </p>

            {/* Address & Policy Notice */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 pt-1 border-t border-neutral-800/80">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Padmavati Nagar, Nallasopara (E)</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{RESTAURANT_INFO.contact.join(' / ')}</span>
              </span>
              <span className="text-amber-400 font-medium">
                Live & Parcel Orders
              </span>
            </div>
          </div>

          {/* Quick Table Service Controls */}
          <div className="flex flex-col gap-2 shrink-0">
            {serviceMessage && (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{serviceMessage}</span>
              </div>
            )}

            {currentTableActiveAlert && !serviceMessage && (
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Staff notified ({currentTableActiveAlert.message})</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerAlert('call_waiter', 'Call Waiter')}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Call Waiter</span>
              </button>

              <button
                onClick={() => triggerAlert('water', 'Water Request')}
                className="px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-medium text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                title="Request Drinking Water Refill"
              >
                <Droplet className="w-4 h-4 text-sky-400" />
                <span className="hidden xs:inline">Water</span>
              </button>

              <button
                onClick={() => triggerAlert('request_bill', 'Bill Request')}
                className="px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-medium text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                title="Request Final Bill"
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span className="hidden xs:inline">Bill</span>
              </button>
            </div>

            {hasActiveOrder && (
              <button
                onClick={onOpenOrderTracker}
                className="w-full px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Track Active Order #{latestCurrentTableOrder.orderNumber} ({latestCurrentTableOrder.status.toUpperCase()})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
