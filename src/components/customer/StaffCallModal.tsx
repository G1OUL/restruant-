import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Droplet, 
  UtensilsCrossed, 
  Receipt, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Trash2
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ServiceAlertType } from '../../types';

interface StaffCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTableModal?: () => void;
}

export const StaffCallModal: React.FC<StaffCallModalProps> = ({
  isOpen,
  onClose,
  onOpenTableModal,
}) => {
  const {
    tableNumber,
    sendServiceAlert,
    cancelServiceAlert,
    currentTableActiveAlert,
  } = useRestaurant();

  const [customNote, setCustomNote] = useState('');
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrigger = (type: ServiceAlertType, label: string) => {
    sendServiceAlert(type, customNote.trim() ? `${label} - Note: ${customNote.trim()}` : undefined);
    setSuccessFeedback(label);
    setCustomNote('');
    setTimeout(() => {
      setSuccessFeedback(null);
    }, 3500);
  };

  const quickOptions: {
    type: ServiceAlertType;
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClasses: string;
    borderClasses: string;
  }[] = [
    {
      type: 'call_waiter',
      title: 'Call Waiter',
      description: 'Order help, questions or table service',
      icon: <Bell className="w-5 h-5 text-amber-500" />,
      colorClasses: 'bg-amber-500/10 text-amber-900 dark:text-amber-100',
      borderClasses: 'border-amber-500/30 hover:border-amber-500',
    },
    {
      type: 'water',
      title: 'Water Refill',
      description: 'Chilled or regular drinking water',
      icon: <Droplet className="w-5 h-5 text-sky-500" />,
      colorClasses: 'bg-sky-500/10 text-sky-900 dark:text-sky-100',
      borderClasses: 'border-sky-500/30 hover:border-sky-500',
    },
    {
      type: 'cutlery',
      title: 'Plates & Cutlery',
      description: 'Extra plates, spoons, forks & napkins',
      icon: <UtensilsCrossed className="w-5 h-5 text-indigo-500" />,
      colorClasses: 'bg-indigo-500/10 text-indigo-900 dark:text-indigo-100',
      borderClasses: 'border-indigo-500/30 hover:border-indigo-500',
    },
    {
      type: 'sauces',
      title: 'Schezwan & Sauces',
      description: 'Extra chutney, chilli vinegar & dip',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      colorClasses: 'bg-rose-500/10 text-rose-900 dark:text-rose-100',
      borderClasses: 'border-rose-500/30 hover:border-rose-500',
    },
    {
      type: 'clean_table',
      title: 'Clear & Clean Table',
      description: 'Clear empty dishes & wipe table',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      colorClasses: 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-100',
      borderClasses: 'border-emerald-500/30 hover:border-emerald-500',
    },
    {
      type: 'request_bill',
      title: 'Request Bill / Payment',
      description: 'Ready to pay via UPI QR or Cash',
      icon: <Receipt className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      colorClasses: 'bg-amber-500/10 text-amber-900 dark:text-amber-100',
      borderClasses: 'border-amber-500/40 hover:border-amber-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-50">
                  Call Restaurant Staff
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  {tableNumber.replace(/ \(.*\)/, '')}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                1-tap direct alert to our floor runners & captain
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

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Active Alert Banner if pending */}
          {currentTableActiveAlert && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Active Request in Progress
                  </p>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    {currentTableActiveAlert.message}
                  </p>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 block">
                    Staff notified · A runner is on the way to {tableNumber}
                  </span>
                </div>
              </div>

              <button
                onClick={() => cancelServiceAlert(currentTableActiveAlert.id)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 transition-colors shrink-0 flex items-center gap-1"
                title="Cancel this alert if already assisted"
              >
                <Trash2 className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {/* Success Flash Toast */}
          {successFeedback && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-2 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successFeedback} sent! Floor staff will attend your table shortly.</span>
            </div>
          )}

          {/* Grid of 6 quick request options */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Choose Quick Assistance
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => handleTrigger(opt.type, opt.title)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all active:scale-[0.98] ${opt.colorClasses} ${opt.borderClasses}`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-xs shrink-0">
                    {opt.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      {opt.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug mt-0.5">
                      {opt.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note Input */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Add Specific Note for Staff (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Please bring extra chair, ice cubes, extra spicy chutney..."
                className="flex-1 px-3 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:border-amber-500 outline-hidden"
              />
              {customNote.trim() && (
                <button
                  onClick={() => handleTrigger('call_waiter', 'Custom Table Note')}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Seated at: <strong className="text-neutral-900 dark:text-neutral-100">{tableNumber}</strong>
          </span>
          {onOpenTableModal && (
            <button
              onClick={() => {
                onClose();
                onOpenTableModal();
              }}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Wrong table? Change seating
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
