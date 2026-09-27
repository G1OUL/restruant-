import React, { useState } from 'react';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  DollarSign, 
  UtensilsCrossed, 
  Printer, 
  Check, 
  TrendingUp,
  XCircle,
  ToggleLeft,
  ToggleRight,
  QrCode
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, OrderStatus } from '../../types';
import { RESTAURANT_INFO } from '../../data/restaurantData';

interface KitchenViewProps {
  onOpenTableQRModal?: () => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({ onOpenTableQRModal }) => {
  const {
    orders,
    updateOrderStatus,
    menu,
    toggleItemAvailability,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'kot' | 'inventory' | 'history'>('kot');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // KOT active orders: received, preparing, ready
  const kotOrders = orders.filter(
    (o) => o.status === 'received' || o.status === 'preparing' || o.status === 'ready'
  );

  const completedOrders = orders.filter(
    (o) => o.status === 'served' || o.status === 'completed'
  );

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const outOfStockCount = menu.filter((m) => !m.isAvailable).length;

  const filteredMenuItems = menu.filter((item) =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const getElapsedTime = (isoDate: string) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    return `${diffMins}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Kitchen Display System (KDS) & Admin
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 mt-1">
            Wok Station & KOT Dispatch
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time ticket dispatching, ingredient availability, and dining room telemetry.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('kot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'kot'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Live KOT ({kotOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Stock / Menu ({outOfStockCount > 0 ? `${outOfStockCount} Out` : 'All In'})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Sales & Completed ({completedOrders.length})</span>
          </button>
        </div>

        {onOpenTableQRModal && (
          <button
            onClick={onOpenTableQRModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Table QR Stands / Print</span>
          </button>
        )}
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Active KOTs
          </span>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tabular-nums mt-1">
            {kotOrders.length}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400">
            {kotOrders.filter((o) => o.status === 'received').length} awaiting wok
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Woks Sizzling
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums mt-1">
            {kotOrders.filter((o) => o.status === 'preparing').length}
          </div>
          <span className="text-[11px] text-neutral-500">Currently in cooking</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Completed Today
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            {completedOrders.length}
          </div>
          <span className="text-[11px] text-neutral-500">Fulfilled orders</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Total Revenue
          </span>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tabular-nums mt-1">
            ₹{totalRevenue}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Active shift balance</span>
        </div>
      </div>

      {/* TAB 1: LIVE KOT TICKETS */}
      {activeTab === 'kot' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
              Live Kitchen Tickets ({kotOrders.length})
            </h3>
            <span className="text-xs text-neutral-500">Auto-synced</span>
          </div>

          {kotOrders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                All KOTs are clear!
              </h4>
              <p className="text-xs text-neutral-500">
                Wok station is clean. Waiting for new customer orders.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kotOrders.map((order) => {
                const isNew = order.status === 'received';
                const isCooking = order.status === 'preparing';
                const isReady = order.status === 'ready';

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border-2 flex flex-col justify-between overflow-hidden shadow-sm transition-all ${
                      isNew
                        ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20'
                        : isCooking
                        ? 'border-orange-500 bg-white dark:bg-neutral-900'
                        : 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                    }`}
                  >
                    <div>
                      {/* Ticket Header */}
                      <div className="p-3.5 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-neutral-100/60 dark:bg-neutral-800/60">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-neutral-900 dark:text-neutral-100">
                            #{order.orderNumber}
                          </span>
                          <span className="font-extrabold text-xs text-neutral-900 dark:text-neutral-100">
                            {order.tableNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{getElapsedTime(order.createdAt)}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="p-4 space-y-2.5">
                        {order.items.map((item) => (
                          <div
                            key={item.cartItemId}
                            className="flex items-start justify-between text-xs border-b border-neutral-100 dark:border-neutral-800/60 pb-2"
                          >
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-black tabular-nums text-xs shrink-0">
                                {item.quantity}
                              </span>
                              <div>
                                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                                  {item.name}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                                  <span className="uppercase font-semibold text-amber-600 dark:text-amber-400">
                                    {item.portion} Portion
                                  </span>
                                  {item.specialInstructions && (
                                    <span className="text-red-500 font-semibold italic">
                                      ★ {item.specialInstructions}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="font-semibold tabular-nums text-neutral-600 dark:text-neutral-400">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}

                        {/* Special Order Note */}
                        {order.specialInstructions && (
                          <div className="p-2.5 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                            ⚠️ Instructions: {order.specialInstructions}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* KOT Action Bar */}
                    <div className="p-3.5 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs"
                        title="Print / View KOT Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {isNew && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Start Cooking</span>
                        </button>
                      )}

                      {isCooking && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Ready for Server</span>
                        </button>
                      )}

                      {isReady && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'served')}
                          className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Served</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & DISH AVAILABILITY (OUT OF STOCK MANAGER) */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
                Menu Item Availability & 86 List
              </h3>
              <p className="text-xs text-neutral-500">
                Toggle dishes off when ingredients run out. Instantly updates customer QR app.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search dish to toggle..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  item.isAvailable
                    ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                    : 'bg-red-50/60 dark:bg-red-950/20 border-red-300 dark:border-red-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {item.category} · ₹{item.priceFull}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                    item.isAvailable
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                      : 'bg-red-600 text-white hover:bg-red-500'
                  }`}
                >
                  {item.isAvailable ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-600" />
                      <span>In Stock</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-white" />
                      <span>Sold Out</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETED ORDERS & REVENUE */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
            Today's Order Log ({orders.length})
          </h3>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Table</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total</th>
                    <th className="p-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="p-3 font-mono font-bold">#{o.orderNumber}</td>
                      <td className="p-3 font-semibold">{o.tableNumber}</td>
                      <td className="p-3 text-neutral-500">
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3">
                        <span className="truncate max-w-[200px] block">
                          {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 capitalize">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 font-bold tabular-nums">₹{o.totalAmount}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedReceiptOrder(o)}
                          className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          View Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white text-neutral-950 p-6 rounded-2xl shadow-2xl font-mono text-xs space-y-4">
            <div className="text-center border-b border-dashed border-neutral-300 pb-3 space-y-1">
              <h3 className="font-bold text-base tracking-tight">{RESTAURANT_INFO.name}</h3>
              <p className="text-[10px] text-neutral-600">{RESTAURANT_INFO.hindiName}</p>
              <p className="text-[10px] text-neutral-600 max-w-[240px] mx-auto">
                {RESTAURANT_INFO.address}
              </p>
              <p className="text-[10px] font-bold text-neutral-700">
                Ph: {RESTAURANT_INFO.contact.join(' / ')}
              </p>
            </div>

            <div className="flex justify-between text-[11px] border-b border-neutral-200 pb-2">
              <div>
                <span>Ticket: #{selectedReceiptOrder.orderNumber}</span>
                <br />
                <span>{selectedReceiptOrder.tableNumber}</span>
              </div>
              <div className="text-right">
                <span>Date: {new Date(selectedReceiptOrder.createdAt).toLocaleDateString()}</span>
                <br />
                <span>Time: {new Date(selectedReceiptOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className="space-y-1.5 border-b border-dashed border-neutral-300 pb-3">
              {selectedReceiptOrder.items.map((i) => (
                <div key={i.cartItemId} className="flex justify-between">
                  <span>
                    {i.quantity} x {i.name} ({i.portion})
                  </span>
                  <span className="tabular-nums">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 border-b border-neutral-300 pb-3 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="tabular-nums">₹{selectedReceiptOrder.subtotal}</span>
              </div>
              {selectedReceiptOrder.timePassCharge > 0 && (
                <div className="flex justify-between">
                  <span>Time Pass Extra:</span>
                  <span className="tabular-nums">₹{selectedReceiptOrder.timePassCharge}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-neutral-900">
                <span>Total Amount:</span>
                <span className="tabular-nums">₹{selectedReceiptOrder.totalAmount}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-neutral-500 pt-1 space-y-1">
              <p>Thank you for dining with Uncle's Chinese!</p>
              <p>Please Visit Again</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="flex-1 py-2 rounded-lg bg-neutral-200 text-neutral-800 font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-neutral-900 text-white font-bold flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
