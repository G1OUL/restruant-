import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Printer,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
  Smartphone,
  Layers,
  UtensilsCrossed,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { RESTAURANT_INFO } from '../../data/restaurantData';
import { generateQRCodeDataUrl, getTableScanUrl, playScanBeep } from '../../utils/qrUtils';

interface TableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestScan?: (table: string) => void;
}

export const TableQRModal: React.FC<TableQRModalProps> = ({
  isOpen,
  onClose,
  onTestScan,
}) => {
  const { tableNumber, setTableNumber, availableTables } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState(tableNumber);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [allQrs, setAllQrs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Sync selectedTable with current tableNumber when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedTable(tableNumber);
    }
  }, [isOpen, tableNumber]);

  // Generate QR for selected table
  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      setIsLoading(true);
      try {
        const url = getTableScanUrl(selectedTable);
        const dataUrl = await generateQRCodeDataUrl(url, {
          width: 340,
          margin: 1,
          color: {
            dark: '#111827',
            light: '#ffffff',
          },
        });
        if (isMounted) {
          setQrDataUrl(dataUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to generate QR:', err);
        setIsLoading(false);
      }
    };

    if (isOpen) {
      generate();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedTable, isOpen]);

  // Pre-generate all QRs for the multi-table print sheet
  useEffect(() => {
    if (viewMode === 'all' && isOpen) {
      const generateAll = async () => {
        const qrs: Record<string, string> = {};
        for (const tbl of availableTables) {
          const url = getTableScanUrl(tbl);
          const dataUrl = await generateQRCodeDataUrl(url, {
            width: 240,
            margin: 1,
          });
          qrs[tbl] = dataUrl;
        }
        setAllQrs(qrs);
      };
      generateAll();
    }
  }, [viewMode, availableTables, isOpen]);

  if (!isOpen) return null;

  const currentScanUrl = getTableScanUrl(selectedTable);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentScanUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleTestScan = () => {
    playScanBeep();
    setTableNumber(selectedTable);
    if (onTestScan) {
      onTestScan(selectedTable);
    }
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `Uncles_Chinese_${selectedTable.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* Header - Hidden during print */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-900/70 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-neutral-50">
                  Table QR Code & Acrylic Stand
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  Print Ready
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Official table scannable stand for Uncle’s Chinese
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs - Hidden in print */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-950/40 p-1.5 gap-1.5 text-xs font-semibold print:hidden">
          <button
            onClick={() => setViewMode('single')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              viewMode === 'single'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Single Table Stand</span>
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              viewMode === 'all'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Tables Sheet (9 Stands)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 print:p-0">
          {viewMode === 'single' ? (
            <>
              {/* Table Selector Dropdown (Hidden on Print) */}
              <div className="flex items-center justify-between gap-3 print:hidden">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Select Seating Location:
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {availableTables.map((tbl) => (
                    <option key={tbl} value={tbl}>
                      {tbl}
                    </option>
                  ))}
                </select>
              </div>

              {/* REALISTIC ACRYLIC TABLE STAND CARD */}
              <div className="relative mx-auto max-w-sm rounded-3xl p-6 bg-gradient-to-b from-neutral-900 via-neutral-900 to-black text-white shadow-2xl border-4 border-amber-500/40 text-center overflow-hidden print:border-2 print:border-black print:text-black print:bg-white print:shadow-none">
                {/* Golden Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 opacity-80" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 opacity-80" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 opacity-80" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 opacity-80" />

                {/* Restaurant Brand */}
                <div className="mb-2">
                  <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase print:text-neutral-700">
                    {RESTAURANT_INFO.hindiName}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black">
                    {RESTAURANT_INFO.name.toUpperCase()}
                  </h2>
                  <p className="text-[10px] tracking-wider text-amber-300/80 font-semibold uppercase mt-0.5 print:text-neutral-600">
                    Veg. & Non-Veg. Restaurant
                  </p>
                </div>

                {/* Table Number Pill */}
                <div className="inline-block my-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-sm uppercase tracking-wider shadow-md print:bg-black print:text-white">
                  {selectedTable}
                </div>

                {/* Scannable QR Code Canvas */}
                <div className="my-3 mx-auto w-52 h-52 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-2 border-amber-400/40 print:border print:border-black">
                  {isLoading ? (
                    <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
                  ) : qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${selectedTable}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-20 h-20 text-neutral-400" />
                  )}
                </div>

                {/* Scanning instructions */}
                <div className="space-y-1 mt-3">
                  <p className="text-xs font-black tracking-wide text-amber-400 uppercase print:text-black">
                    SCAN WITH YOUR PHONE CAMERA
                  </p>
                  <p className="text-[11px] text-neutral-300 print:text-neutral-700">
                    • Browse Digital Menu & Live Photos
                  </p>
                  <p className="text-[11px] text-neutral-300 print:text-neutral-700">
                    • One-Tap "Call Waiter" & "Request Bill"
                  </p>
                  <p className="text-[11px] text-neutral-300 print:text-neutral-700">
                    • Place Orders Directly to the Wok Kitchen
                  </p>
                </div>

                {/* Footer notes */}
                <div className="mt-4 pt-3 border-t border-neutral-800 print:border-neutral-300 text-[10px] text-neutral-400 print:text-neutral-600">
                  <p>Min Order Free Table Charge: ₹250/-</p>
                  <p className="font-semibold text-neutral-300 print:text-black">
                    Mob: 8446899952 / 7666459952
                  </p>
                  <p className="text-[9px] mt-0.5 truncate opacity-70">
                    Shop 4, Padmavati Nagar, Tulinj Rd, Nallasopara (E)
                  </p>
                </div>
              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 print:hidden">
                <button
                  onClick={handleTestScan}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Test Scan Now</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Link Copied!' : 'Copy QR Link'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Stand</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Save QR PNG</span>
                </button>
              </div>

              {/* URL preview */}
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs print:hidden">
                <span className="truncate text-neutral-500 dark:text-neutral-400 font-mono text-[11px] pr-2">
                  {currentScanUrl}
                </span>
                <a
                  href={currentScanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline shrink-0 flex items-center gap-1"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          ) : (
            /* ALL TABLES SHEET VIEW (FOR RESTAURANT OWNER TO PRINT ALL STANDS) */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between print:hidden">
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <strong>Manager Print Sheet:</strong> Contains scannable QR stands for all 9 restaurant tables. Click Print to print them all on standard A4 cards.
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print All Stands</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 print:grid-cols-3 print:gap-4">
                {availableTables.map((tbl) => {
                  const qr = allQrs[tbl] || qrDataUrl;
                  const isAC = tbl.includes('AC');
                  return (
                    <div
                      key={tbl}
                      className="p-4 rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-center flex flex-col items-center justify-between shadow-xs print:border-black print:shadow-none"
                    >
                      <div className="mb-1">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">Uncle’s Chinese</span>
                        <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                          {tbl}
                        </h4>
                        {isAC && (
                          <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                            AC Room
                          </span>
                        )}
                      </div>

                      <div className="w-32 h-32 p-1.5 bg-white rounded-xl border border-neutral-200 shadow-inner flex items-center justify-center my-2">
                        {qr ? (
                          <img src={qr} alt={tbl} className="w-full h-full object-contain" />
                        ) : (
                          <QrCode className="w-16 h-16 text-neutral-400" />
                        )}
                      </div>

                      <div className="text-[9px] text-neutral-500 mt-1">
                        Scan to Order & Call Waiter
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTable(tbl);
                          setViewMode('single');
                        }}
                        className="mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline print:hidden"
                      >
                        Enlarge / Customize
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 flex items-center justify-between print:hidden">
          <span className="text-xs text-neutral-500">
            Powered by Uncle’s Chinese QR System
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
