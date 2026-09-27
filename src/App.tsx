import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CustomerView } from './components/customer/CustomerView';
import { WaiterView } from './components/waiter/WaiterView';
import { KitchenView } from './components/kitchen/KitchenView';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { TableSelectorModal } from './components/customer/TableSelectorModal';
import { QRScannerModal } from './components/qr/QRScannerModal';
import { TableQRModal } from './components/qr/TableQRModal';
import { RESTAURANT_INFO } from './data/restaurantData';
import { 
  Phone, 
  MapPin, 
  QrCode, 
  UtensilsCrossed, 
  CheckCircle2, 
  Camera, 
  Smartphone, 
  Monitor, 
  Wifi, 
  BatteryMedium 
} from 'lucide-react';

function RestaurantApp() {
  const { currentRole, tableNumber, setCurrentRole } = useRestaurant();

  // Mobile Size by default as requested
  const [isMobileSize, setIsMobileSize] = useState(true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isTableQRModalOpen, setIsTableQRModalOpen] = useState(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  const handleScanSuccess = (newTable: string) => {
    setScanNotification(`Connected to ${newTable}! Menu loaded.`);
    setTimeout(() => setScanNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-900/95 dark:bg-black text-neutral-900 dark:text-neutral-50 flex flex-col items-center selection:bg-amber-500 selection:text-white transition-colors duration-200">
      {/* Top Device Sizing Switcher (visible on desktop/tablets) */}
      <aside aria-label="Device Viewport Controls" className="w-full bg-neutral-950 text-neutral-400 border-b border-neutral-800 text-xs px-4 py-2 hidden sm:flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-neutral-200">Uncle's Chinese Preview:</span>
          <span className="text-[11px] text-neutral-500">Contactless QR Table Ordering Experience</span>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setIsMobileSize(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              isMobileSize
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Size (430px)</span>
          </button>
          <button
            onClick={() => setIsMobileSize(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              !isMobileSize
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Width</span>
          </button>
        </div>
      </aside>

      {/* Main Container: Mobile Phone Mockup or Full Width */}
      <div
        className={`w-full flex-1 flex flex-col transition-all duration-300 ${
          isMobileSize
            ? 'sm:my-6 sm:max-w-[430px] sm:rounded-[46px] sm:border-[10px] sm:border-neutral-800 sm:dark:border-neutral-700 sm:shadow-2xl bg-neutral-50 dark:bg-neutral-950 sm:max-h-[92vh] sm:overflow-hidden relative'
            : 'max-w-7xl mx-auto bg-neutral-50 dark:bg-neutral-950 min-h-screen'
        }`}
      >
        {/* Mobile Phone Simulated Status Bar (Visible in Mobile Size mode on desktop) */}
        {isMobileSize && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-neutral-800 dark:text-neutral-200 text-xs font-semibold shrink-0 select-none bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-100 dark:border-neutral-800/60 z-50">
            <span className="font-bold tracking-tight text-[11px]">9:41</span>
            {/* Dynamic Island pill */}
            <div className="w-24 h-4 bg-neutral-900 dark:bg-neutral-800 rounded-full flex items-center justify-end pr-2 gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-neutral-700 dark:bg-neutral-600" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="font-extrabold text-[9px]">5G</span>
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Top Notification Toast for QR Scans */}
        {scanNotification && (
          <div className="absolute top-16 left-3 right-3 z-50 p-3.5 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-2.5 animate-slideDown border border-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <p className="font-extrabold">{scanNotification}</p>
              <p className="text-emerald-100 text-[10px] mt-0.5">
                Orders & waiter calls connected to this table.
              </p>
            </div>
          </div>
        )}

        {/* Scrollable Viewport Inner Wrapper */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          {/* Top Navigation Bar */}
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenTableModal={() => setIsTableModalOpen(true)}
            onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
          />

          {/* Main Dynamic View Content */}
          <main className="flex-1 w-full px-3 py-3">
            {currentRole === 'customer' && (
              <CustomerView
                onOpenCart={() => setIsCartOpen(true)}
                onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
                onOpenTableModal={() => setIsTableModalOpen(true)}
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
                onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
              />
            )}

            {currentRole === 'waiter' && (
              <WaiterView
                onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
              />
            )}

            {currentRole === 'kitchen' && (
              <KitchenView
                onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
              />
            )}
          </main>

          {/* Clean Restaurant Info / Footer */}
          <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 text-xs text-neutral-500 p-4 transition-colors print:hidden">
            <div className="space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
                  <UtensilsCrossed className="w-3 h-3" />
                </div>
                <span className="font-extrabold text-neutral-900 dark:text-neutral-100 text-xs">
                  {RESTAURANT_INFO.name}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10">
                  {RESTAURANT_INFO.type}
                </span>
              </div>

              <p className="text-[10px] text-neutral-400 leading-tight">
                {RESTAURANT_INFO.address}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] pt-1">
                <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                  <Phone className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{RESTAURANT_INFO.contact[0]}</span>
                </span>
                <span>·</span>
                <button
                  onClick={() => setIsTableQRModalOpen(true)}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Table QRs</span>
                </button>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation Dock */}
          {currentRole === 'customer' && (
            <MobileBottomNav
              onOpenCart={() => setIsCartOpen(true)}
              onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              onOpenTableModal={() => setIsTableModalOpen(true)}
            />
          )}

          {/* Mobile Phone Simulated Home Indicator (Desktop Mobile View only) */}
          {isMobileSize && (
            <div className="hidden sm:block py-1.5 bg-white/95 dark:bg-neutral-900/95 shrink-0 select-none">
              <div className="w-28 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto" />
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Cart & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenTableQRModal={() => setIsTableQRModalOpen(true)}
      />

      {/* QR SCANNER MODAL */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* TABLE QR CODE & ACRYLIC STAND MODAL */}
      <TableQRModal
        isOpen={isTableQRModalOpen}
        onClose={() => setIsTableQRModalOpen(false)}
        onTestScan={handleScanSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <RestaurantApp />
    </RestaurantProvider>
  );
}
