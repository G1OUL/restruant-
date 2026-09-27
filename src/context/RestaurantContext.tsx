import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  PaymentStatus,
  ServiceAlert,
  ServiceAlertType,
  UserRole,
  PortionType,
} from '../types';
import { INITIAL_MENU } from '../data/restaurantData';

interface RestaurantContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Table
  tableNumber: string;
  setTableNumber: (table: string) => void;
  availableTables: string[];

  // Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Menu Management
  menu: MenuItem[];
  toggleItemAvailability: (itemId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, portion: PortionType, specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  timePassCharge: number;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  placeOrder: (specialInstructions?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  currentTableOrders: Order[];
  latestCurrentTableOrder: Order | null;

  // Service Alerts
  serviceAlerts: ServiceAlert[];
  sendServiceAlert: (type: ServiceAlertType, customMessage?: string) => void;
  resolveServiceAlert: (alertId: string) => void;
  currentTableActiveAlert: ServiceAlert | null;

  // Sound feedback
  playNotificationSound: (type?: 'order' | 'alert' | 'success') => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const AVAILABLE_TABLES = [
  'Table 1 (Regular)',
  'Table 2 (Regular)',
  'Table 3 (Regular)',
  'Table 4 (AC Room)',
  'Table 5 (AC Room)',
  'Table 6 (AC Room)',
  'Table 7 (Family Lounge)',
  'Table 8 (Family Lounge)',
  'Parcel / Takeaway #P1',
];

// Helper to synthesize soft restaurant audio chime using Web Audio API
const playWebAudioTone = (type: 'order' | 'alert' | 'success' = 'order') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'alert') {
      // Two-tone bell for waiter call
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, now + 0.2); // D6
      gain2.gain.setValueAtTime(0.35, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.7);
    } else if (type === 'success') {
      // Uplifting confirmation triad
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } else {
      // Gentle kitchen chime
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {
    // Audio autoplay restrictions gracefully handled
  }
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('uncles_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('uncles_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('uncles_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Table state
  const [tableNumber, setTableNumberState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table') || params.get('t');
      if (urlTable) {
        const decoded = decodeURIComponent(urlTable);
        const match = AVAILABLE_TABLES.find((t) => t.toLowerCase().includes(decoded.toLowerCase())) || decoded;
        localStorage.setItem('uncles_table', match);
        return match;
      }
    }
    return localStorage.getItem('uncles_table') || 'Table 4 (AC Room)';
  });

  const setTableNumber = (table: string) => {
    setTableNumberState(table);
    localStorage.setItem('uncles_table', table);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('table', table);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore in SSR/restricted environments
      }
    }
  };

  // Role state
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  // Menu items with out-of-stock management
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    try {
      const savedAvailability = localStorage.getItem('uncles_menu_availability');
      if (savedAvailability) {
        const disabledMap: Record<string, boolean> = JSON.parse(savedAvailability);
        return INITIAL_MENU.map((item) => ({
          ...item,
          isAvailable: disabledMap[item.id] !== undefined ? disabledMap[item.id] : item.isAvailable,
        }));
      }
    } catch {
      // fallback
    }
    return INITIAL_MENU;
  });

  const toggleItemAvailability = (itemId: string) => {
    setMenu((prevMenu) => {
      const updated = prevMenu.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      );
      const disabledMap: Record<string, boolean> = {};
      updated.forEach((i) => {
        disabledMap[i.id] = i.isAvailable;
      });
      localStorage.setItem('uncles_menu_availability', JSON.stringify(disabledMap));
      return updated;
    });
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(`uncles_cart_${tableNumber}`);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(`uncles_cart_${tableNumber}`, JSON.stringify(cart));
  }, [cart, tableNumber]);

  const addToCart = (item: MenuItem, portion: PortionType, specialInstructions?: string) => {
    const itemPrice =
      portion === 'half' && item.priceHalf ? item.priceHalf : item.priceFull;
    const cartItemId = `${item.id}-${portion}-${specialInstructions || 'standard'}`;

    setCart((prev) => {
      const existing = prev.find((ci) => ci.cartItemId === cartItemId);
      if (existing) {
        return prev.map((ci) =>
          ci.cartItemId === cartItemId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItemId: item.id,
          name: item.name,
          category: item.category,
          diet: item.diet,
          portion,
          price: itemPrice,
          quantity: 1,
          image: item.image,
          specialInstructions,
        },
      ];
    });

    playWebAudioTone('order');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Menu policy: Orders worth Rs. 250 & more, time pass charge Rs 20 if less
  const timePassCharge = cartSubtotal > 0 && cartSubtotal < 250 ? 20 : 0;
  const cartTotal = cartSubtotal + timePassCharge;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = localStorage.getItem('uncles_orders');
      if (savedOrders) return JSON.parse(savedOrders);
    } catch {
      // fallback
    }
    // Initial sample order for demonstration in kitchen & waiter view
    return [
      {
        id: 'ord-101',
        orderNumber: 101,
        tableNumber: 'Table 4 (AC Room)',
        items: [
          {
            cartItemId: 'sample-1',
            menuItemId: 'vs-1',
            name: 'Manchow Soup',
            category: 'Veg Soups',
            diet: 'veg',
            portion: 'half',
            price: 70,
            quantity: 2,
            image: INITIAL_MENU[0].image,
            specialInstructions: 'Extra crispy noodles please',
          },
          {
            cartItemId: 'sample-2',
            menuItemId: 'vn-2',
            name: 'Veg Schezwan Noodles',
            category: 'Veg Noodles',
            diet: 'veg',
            portion: 'full',
            price: 160,
            quantity: 1,
            image: INITIAL_MENU[39].image,
          },
        ],
        subtotal: 300,
        timePassCharge: 0,
        totalAmount: 300,
        status: 'preparing',
        paymentStatus: 'unpaid',
        specialInstructions: 'Serving together with soups',
        createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
      },
      {
        id: 'ord-102',
        orderNumber: 102,
        tableNumber: 'Table 2 (Regular)',
        items: [
          {
            cartItemId: 'sample-3',
            menuItemId: 'nvst-3',
            name: 'Chicken Lollipop Oil Fry',
            category: 'Non-Veg Starters',
            diet: 'non-veg',
            portion: 'full',
            price: 180,
            quantity: 1,
            image: INITIAL_MENU[19].image,
          },
          {
            cartItemId: 'sample-4',
            menuItemId: 'nvr-7',
            name: 'Triple Schezwan Chicken Rice',
            category: 'Non-Veg Rice',
            diet: 'non-veg',
            portion: 'full',
            price: 180,
            quantity: 1,
            image: INITIAL_MENU[33].image,
          },
        ],
        subtotal: 360,
        timePassCharge: 0,
        totalAmount: 360,
        status: 'received',
        paymentStatus: 'unpaid',
        createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('uncles_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (specialInstructions?: string): Order => {
    const newOrderNumber =
      orders.length > 0 ? Math.max(...orders.map((o) => o.orderNumber)) + 1 : 101;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      tableNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      timePassCharge,
      totalAmount: cartTotal,
      status: 'received',
      paymentStatus: 'unpaid',
      specialInstructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    playWebAudioTone('success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
    playWebAudioTone('order');
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus,
              status: paymentStatus === 'paid_cash' || paymentStatus === 'paid_online' ? 'completed' : o.status,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
  };

  const currentTableOrders = orders.filter((o) => o.tableNumber === tableNumber);
  const latestCurrentTableOrder = currentTableOrders.length > 0 ? currentTableOrders[0] : null;

  // Service alerts (Waiter call & bill request)
  const [serviceAlerts, setServiceAlerts] = useState<ServiceAlert[]>(() => {
    try {
      const savedAlerts = localStorage.getItem('uncles_alerts');
      return savedAlerts ? JSON.parse(savedAlerts) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('uncles_alerts', JSON.stringify(serviceAlerts));
  }, [serviceAlerts]);

  const sendServiceAlert = (type: ServiceAlertType, customMessage?: string) => {
    const defaultMessages: Record<ServiceAlertType, string> = {
      call_waiter: 'Assistance requested at table',
      request_bill: 'Bill requested (ready for payment)',
      water: 'Drinking water refill requested',
      cutlery: 'Extra plates & spoons requested',
    };

    const newAlert: ServiceAlert = {
      id: `alert-${Date.now()}`,
      tableNumber,
      type,
      message: customMessage || defaultMessages[type],
      createdAt: new Date().toISOString(),
      isResolved: false,
    };

    setServiceAlerts((prev) => [newAlert, ...prev]);
    playWebAudioTone('alert');
  };

  const resolveServiceAlert = (alertId: string) => {
    setServiceAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isResolved: true } : a))
    );
  };

  const currentTableActiveAlert =
    serviceAlerts.find((a) => a.tableNumber === tableNumber && !a.isResolved) || null;

  return (
    <RestaurantContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        tableNumber,
        setTableNumber,
        availableTables: AVAILABLE_TABLES,
        currentRole,
        setCurrentRole,
        menu,
        toggleItemAvailability,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        timePassCharge,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        currentTableOrders,
        latestCurrentTableOrder,
        serviceAlerts,
        sendServiceAlert,
        resolveServiceAlert,
        currentTableActiveAlert,
        playNotificationSound: playWebAudioTone,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
