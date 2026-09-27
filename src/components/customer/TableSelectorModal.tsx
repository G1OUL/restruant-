import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Check,
  Smartphone,
  Printer,
  Camera,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { generateQRCodeDataUrl, getTableScanUrl, playScanBeep } from '../../utils/qrUtils';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQRScanner: () => void;
  onOpenTableQRModal: () => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
  onOpenQRScanner,
  onOpenTableQRModal,
}) => {
  const { tableNumber, setTableNumber, availableTables } = useRestaurant();
  const [selected, setSelected] = useState(tableNumber);
  const [showQRPreview, setShowQRPreview] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelected(tableNumber);
    }
  }, [isOpen, tableNumber]);

  useEffect(() => {
    let active = true;
    if (showQRPreview) {
      const url = getTableScanUrl(selected);
      generateQRCodeDataUrl(url, { width: 220, margin: 1 }).then((data) => {
        if (active) setQrDataUrl(data);
      });
    }
    return () => {
      active = false;
    };
  }, [selected, showQRPreview]);

  if (!isOpen) return null;

  const handleApply = () => {
    playScanBeep();
    setTableNumber(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-50">
                Table & QR Scanner
              </h3>
              <p className="text-xs text-neutral-500">
                Scan table stand or choose your seating
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Scanner Action Banner */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-amber-950 dark:text-amber-200">
            <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Have a physical QR code on your table?</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenQRScanner();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs transition-transform active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Open Scanner</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Select Your Table
            </label>
            <button
              onClick={() => {
                onClose();
                onOpenTableQRModal();
              }}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Print/View Stands</span>
            </button>
          </div>

          {/* Table List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {availableTables.map((tbl) => {
              const isSelected = selected === tbl;
              const isAC = tbl.includes('AC');
              const isParcel = tbl.includes('Parcel');

              return (
                <button
                  key={tbl}
                  onClick={() => setSelected(tbl)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-amber-500 animate-ping' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    />
                    <span className="text-xs font-bold">{tbl}</span>
                    {isAC && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                        AC Room
                      </span>
                    )}
                    {isParcel && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Takeaway
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* QR Code Stand Quick Preview */}
          <div className="pt-1">
            <button
              onClick={() => setShowQRPreview(!showQRPreview)}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQRPreview ? 'Hide Quick QR' : 'Show Scannable QR for this Table'}</span>
            </button>

            {showQRPreview && (
              <div className="mt-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex flex-col items-center text-center animate-fadeIn">
                <div className="w-36 h-36 bg-white p-2.5 rounded-xl shadow-md border border-neutral-200 flex flex-col items-center justify-center">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt={selected} className="w-full h-full object-contain" />
                  ) : (
                    <QrCode className="w-16 h-16 text-neutral-400" />
                  )}
                </div>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs font-black text-neutral-900 dark:text-neutral-100">
                    Uncle's Chinese · {selected}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Point any camera at this QR to test instant seating
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-sm transition-all"
          >
            Switch Seating to {selected.replace(/ \(.*\)/, '')}
          </button>
        </div>
      </div>
    </div>
  );
};
