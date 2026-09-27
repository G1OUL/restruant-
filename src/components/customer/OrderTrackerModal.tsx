import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Utensils, 
  Sparkles, 
  Bell, 
  Receipt,
  AlertCircle
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderStatus } from '../../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    tableNumber,
    currentTableOrders,
    sendServiceAlert,
    currentTableActiveAlert,
  } = useRestaurant();

  if (!isOpen) return null;

  const activeOrders = currentTableOrders.filter((o) => o.status !== 'cancelled');
  const latestOrder = activeOrders[0];

  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'received',
      label: 'Order Received',
      icon: <Clock className="w-4 h-4" />,
      desc: 'Ticket confirmed at kitchen counter',
    },
    {
      key: 'preparing',
      label: 'Preparing in Wok',
      icon: <Flame className="w-4 h-4" />,
      desc: 'Chef is wok-frying fresh ingredients',
    },
    {
      key: 'ready',
      label: 'Ready for Service',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Plated and ready at pickup counter',
    },
    {
      key: 'served',
      label: 'Served to Table',
      icon: <Utensils className="w-4 h-4" />,
      desc: 'Enjoy your meal at Uncle’s Chinese!',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'served':
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = latestOrder ? getStepIndex(latestOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Live Table Tracking
            </span>
            <h2 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-50">
              {tableNumber} Status
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!latestOrder ? (
            <div className="text-center py-8 text-neutral-500 space-y-2">
              <AlertCircle className="w-10 h-10 mx-auto text-neutral-400" />
              <p className="font-semibold text-sm">No active orders placed yet</p>
              <p className="text-xs">Browse our menu and place your first order!</p>
            </div>
          ) : (
            <>
              {/* Active Order Card */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Latest Order
                  </span>
                  <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50">
                    Ticket #{latestOrder.orderNumber}
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Placed at {new Date(latestOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-neutral-500">Total</span>
                  <div className="text-base font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    ₹{latestOrder.totalAmount}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 uppercase">
                    {latestOrder.status}
                  </span>
                </div>
              </div>

              {/* Step Progression Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Preparation Progress
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                  {steps.map((step, idx) => {
                    const isDone = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.key} className="relative flex items-start gap-3">
                        {/* Status Circle */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-500 text-neutral-950 ring-4 ring-amber-500/20 animate-pulse'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : isDone
                                  ? 'text-neutral-900 dark:text-neutral-100'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List in this Order */}
              <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Items Ordered
                </h4>

                <div className="space-y-1.5">
                  {latestOrder.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {item.name}
                        </span>
                        <span className="text-[10px] capitalize text-neutral-400">
                          ({item.portion})
                        </span>
                      </div>
                      <span className="tabular-nums font-semibold text-neutral-700 dark:text-neutral-300">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {latestOrder.specialInstructions && (
                  <p className="text-[11px] text-neutral-500 italic bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg mt-2">
                    Chef note: "{latestOrder.specialInstructions}"
                  </p>
                )}
              </div>
            </>
          )}

          {/* Quick Service Assist Buttons */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-2">
            <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Need assistance at your table?
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => sendServiceAlert('call_waiter')}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Call Waiter</span>
              </button>

              <button
                onClick={() => sendServiceAlert('request_bill')}
                className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Receipt className="w-4 h-4" />
                <span>Request Bill</span>
              </button>
            </div>
            {currentTableActiveAlert && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center font-medium animate-pulse">
                Staff alert pending: {currentTableActiveAlert.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
