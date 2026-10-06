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
  QrCode,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { RESTAURANT_INFO } from '../../data/restaurantData';
import { ASSET_IMAGES } from '../../data/foodAssets';

interface WelcomeBannerProps {
  onOpenOrderTracker: () => void;
  onOpenTableModal: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
  onOpenStaffCall: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onOpenOrderTracker,
  onOpenTableModal,
  onOpenQRScanner,
  onOpenTableQRModal,
  onOpenStaffCall,
}) => {
  const {
    tableNumber,
    sendServiceAlert,
    currentTableActiveAlert,
    latestCurrentTableOrder,
  } = useRestaurant();

  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  const triggerQuickWater = () => {
    sendServiceAlert('water', 'Drinking water refill requested');
    setServiceMessage('Water refill requested! Staff alerted.');
    setTimeout(() => setServiceMessage(null), 3500);
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
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/45" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            {/* Table Badge and Restaurant Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenTableModal}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold hover:bg-amber-500/30 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{tableNumber.replace(/ \(.*\)/, '')}</span>
                <span className="text-[10px] text-amber-200/70 font-normal">· Change</span>
              </button>

              <button
                onClick={onOpenQRScanner}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>

              <button
                onClick={onOpenTableQRModal}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700 text-xs font-semibold transition-colors flex items-center gap-1"
                title="View physical acrylic QR stand"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>QR Stands</span>
              </button>

              <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Wok Stir-Fry</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Authentic Indian Chinese Cuisine
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Order directly from your seat with our contactless QR menu. Savor sizzling starters, Hakka noodles, and triple rice tossed live in high-heat woks.
            </p>

            {/* Address & Policy Notice */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 pt-1 border-t border-neutral-800">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Padmavati Nagar, Nallasopara (E)</span>
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{RESTAURANT_INFO.contact[0]}</span>
              </span>
            </div>
          </div>

          {/* Quick Table Service Controls */}
          <div className="flex flex-col gap-2 shrink-0">
            {serviceMessage && (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{serviceMessage}</span>
              </div>
            )}

            {currentTableActiveAlert && !serviceMessage && (
              <div className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Staff Alert: {currentTableActiveAlert.message}</span>
                </div>
                <button
                  onClick={onOpenStaffCall}
                  className="text-amber-200 underline text-[11px] font-bold"
                >
                  View
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Primary Call Staff Button */}
              <button
                onClick={onOpenStaffCall}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Call Staff</span>
              </button>

              {/* Quick Water Button */}
              <button
                onClick={triggerQuickWater}
                className="px-3.5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                title="Request water refill"
              >
                <Droplet className="w-4 h-4 text-sky-400" />
                <span>Water</span>
              </button>

              {/* Request Bill Button */}
              <button
                onClick={onOpenStaffCall}
                className="px-3.5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                title="Request Bill"
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Bill</span>
              </button>
            </div>

            {hasActiveOrder && (
              <button
                onClick={onOpenOrderTracker}
                className="w-full px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-between gap-2 shadow-md transition-all active:scale-98"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Order #{latestCurrentTableOrder.orderNumber} ({latestCurrentTableOrder.status.toUpperCase()})</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
