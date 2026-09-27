import React, { useState } from 'react';
import { 
  Bell, 
  Receipt, 
  CheckCircle, 
  Clock, 
  Utensils, 
  AlertTriangle, 
  Check, 
  DollarSign, 
  ChevronRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderStatus, PaymentStatus } from '../../types';

interface WaiterViewProps {
  onOpenTableQRModal?: () => void;
  onOpenQRScanner?: () => void;
}

export const WaiterView: React.FC<WaiterViewProps> = ({
  onOpenTableQRModal,
  onOpenQRScanner,
}) => {
  const {
    availableTables,
    serviceAlerts,
    resolveServiceAlert,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    setTableNumber,
    setCurrentRole,
  } = useRestaurant();

  const [filterType, setFilterType] = useState<'all' | 'alerts' | 'active_orders'>('all');
  const [selectedTableDetails, setSelectedTableDetails] = useState<string | null>(null);

  // Unresolved alerts
  const pendingAlerts = serviceAlerts.filter((a) => !a.isResolved);

  // Active (in-progress) orders
  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Top Staff Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Floor Staff Console
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 mt-1">
            Table Service & Runner Dashboard
          </h2>
          <p className="text-xs text-neutral-500">
            Monitor real-time table assistance calls, bill requests, and dish delivery.
          </p>
        </div>

        {/* Actions & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onOpenQRScanner && (
            <button
              onClick={onOpenQRScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Table QR</span>
            </button>
          )}

          {onOpenTableQRModal && (
            <button
              onClick={onOpenTableQRModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-500" />
              <span>Print Stands</span>
            </button>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            All Floor
          </button>
          <button
            onClick={() => setFilterType('alerts')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'alerts'
                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts ({pendingAlerts.length})</span>
          </button>
          <button
            onClick={() => setFilterType('active_orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'active_orders'
                ? 'bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          </div>
        </div>
      </div>

      {/* PRIORITY ALERTS SECTION (Call Waiter / Request Bill) */}
      {pendingAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
              Urgent Service Requests ({pendingAlerts.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingAlerts.map((alert) => {
              const isBill = alert.type === 'request_bill';
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md animate-fadeIn ${
                    isBill
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40'
                      : 'border-red-500 bg-red-50/80 dark:bg-red-950/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isBill
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {isBill ? <Receipt className="w-5 h-5" /> : <Bell className="w-5 h-5 animate-spin" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
                          {alert.tableNumber}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => resolveServiceAlert(alert.id)}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Attend</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TABLE STATUS GRID */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
          Floor Layout & Table Cards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableTables.map((tbl) => {
            const tableAlert = pendingAlerts.find((a) => a.tableNumber === tbl);
            const tableOrder = orders.find(
              (o) => o.tableNumber === tbl && o.status !== 'completed' && o.status !== 'cancelled'
            );

            return (
              <div
                key={tbl}
                className={`p-4 rounded-2xl border transition-all ${
                  tableAlert
                    ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20 shadow-md ring-2 ring-red-500/20'
                    : tableOrder
                    ? 'border-amber-300 dark:border-amber-800 bg-white dark:bg-neutral-900 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 opacity-80'
                }`}
              >
                {/* Table Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        tableAlert
                          ? 'bg-red-500 animate-ping'
                          : tableOrder
                          ? 'bg-amber-500'
                          : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    />
                    <h4 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-50">
                      {tbl}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tableAlert
                        ? 'bg-red-500 text-white'
                        : tableOrder
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {tableAlert
                      ? 'Service Called'
                      : tableOrder
                      ? tableOrder.status.toUpperCase()
                      : 'Available'}
                  </span>
                </div>

                {/* Table Content */}
                <div className="py-3 space-y-2">
                  {tableOrder ? (
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-500">
                          Order #{tableOrder.orderNumber}
                        </span>
                        <span className="font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          ₹{tableOrder.totalAmount}
                        </span>
                      </div>

                      <div className="mt-1.5 space-y-1">
                        {tableOrder.items.slice(0, 3).map((item) => (
                          <div
                            key={item.cartItemId}
                            className="flex items-center justify-between text-[11px] text-neutral-700 dark:text-neutral-300"
                          >
                            <span className="truncate max-w-[180px]">
                              {item.quantity}x {item.name} ({item.portion})
                            </span>
                            <span className="tabular-nums">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        {tableOrder.items.length > 3 && (
                          <span className="text-[10px] text-neutral-400">
                            +{tableOrder.items.length - 3} more items...
                          </span>
                        )}
                      </div>

                      {/* Quick Status Action for Waiter */}
                      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5">
                        {tableOrder.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(tableOrder.id, 'served')}
                            className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            <Utensils className="w-3.5 h-3.5" />
                            <span>Mark Served to Table</span>
                          </button>
                        )}

                        {tableOrder.status === 'served' && tableOrder.paymentStatus !== 'paid_cash' && (
                          <button
                            onClick={() => updatePaymentStatus(tableOrder.id, 'paid_cash')}
                            className="w-full py-1.5 px-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Settle Bill (Cash/UPI)</span>
                          </button>
                        )}

                        {tableOrder.status === 'received' && (
                          <div className="text-[11px] text-neutral-500 italic flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Waiting for Kitchen to start cooking</span>
                          </div>
                        )}

                        {tableOrder.status === 'preparing' && (
                          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span>Wok Sizzling in Kitchen</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-xs text-neutral-400">
                      No active orders at this table
                    </div>
                  )}
                </div>

                {/* Footer Switch Link */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => {
                      setTableNumber(tbl);
                      setCurrentRole('customer');
                    }}
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <span>Open Customer View</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
