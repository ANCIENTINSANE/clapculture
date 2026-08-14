'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, OrderStatus, PaymentStatus } from '@clapculture/shared';

// ─── Types ───────────────────────────────────────────────────────────
export interface CheckoutInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderData {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CheckoutInfo;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  transactionId?: string;
  screenshotUrl?: string;
}

// ─── Context ─────────────────────────────────────────────────────────
interface OrderStoreContextType {
  // Checkout info
  checkoutInfo: CheckoutInfo;
  setCheckoutInfo: (info: CheckoutInfo) => void;

  // Current order
  currentOrder: OrderData | null;
  createOrder: (orderId: string, items: CartItem[], subtotal: number, shipping: number, customer: CheckoutInfo) => void;
  updatePaymentInfo: (transactionId: string, screenshotUrl?: string) => void;
  getOrder: (orderId: string) => OrderData | null;

  // Order history (session-based)
  orders: OrderData[];
}

const emptyCheckoutInfo: CheckoutInfo = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  pincode: '',
};

const OrderStoreContext = createContext<OrderStoreContextType | undefined>(undefined);

export function OrderStoreProvider({ children }: { children: ReactNode }) {
  const [checkoutInfo, setCheckoutInfoState] = useState<CheckoutInfo>(emptyCheckoutInfo);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage once mounted on client
  useEffect(() => {
    try {
      const storedCheckout = sessionStorage.getItem('cc_checkout');
      if (storedCheckout) setCheckoutInfoState(JSON.parse(storedCheckout));

      const storedOrders = sessionStorage.getItem('cc_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedCurrentOrder = sessionStorage.getItem('cc_current_order');
      if (storedCurrentOrder) setCurrentOrder(JSON.parse(storedCurrentOrder));
    } catch (e) {
      console.error('Failed to load order store from sessionStorage:', e);
    }
    setIsHydrated(true);
  }, []);

  // Persist to sessionStorage on changes
  useEffect(() => {
    if (isHydrated) {
      try {
        sessionStorage.setItem('cc_checkout', JSON.stringify(checkoutInfo));
      } catch (e) {
        console.error('Failed to save checkoutInfo:', e);
      }
    }
  }, [checkoutInfo, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        sessionStorage.setItem('cc_orders', JSON.stringify(orders));
      } catch (e) {
        console.error('Failed to save orders:', e);
      }
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (isHydrated && currentOrder) {
      try {
        sessionStorage.setItem('cc_current_order', JSON.stringify(currentOrder));
      } catch (e) {
        console.error('Failed to save current order:', e);
      }
    }
  }, [currentOrder, isHydrated]);

  const setCheckoutInfo = (info: CheckoutInfo) => {
    setCheckoutInfoState(info);
  };

  const createOrder = (
    orderId: string,
    items: CartItem[],
    subtotal: number,
    shipping: number,
    customer: CheckoutInfo
  ) => {
    const order: OrderData = {
      orderId,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      customer,
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      createdAt: new Date().toISOString(),
    };
    setCurrentOrder(order);
    setOrders((prev) => [...prev, order]);
  };

  const updatePaymentInfo = (transactionId: string, screenshotUrl?: string) => {
    if (!currentOrder) return;
    const updated: OrderData = {
      ...currentOrder,
      transactionId,
      screenshotUrl,
      paymentStatus: 'SUBMITTED',
    };
    setCurrentOrder(updated);
    setOrders((prev) =>
      prev.map((o) => (o.orderId === updated.orderId ? updated : o))
    );
  };

  const getOrder = (orderId: string): OrderData | null => {
    return orders.find((o) => o.orderId === orderId) || currentOrder?.orderId === orderId ? currentOrder : null;
  };

  return React.createElement(
    OrderStoreContext.Provider,
    {
      value: {
        checkoutInfo,
        setCheckoutInfo,
        currentOrder,
        createOrder,
        updatePaymentInfo,
        getOrder,
        orders,
      },
    },
    children
  );
}

export function useOrderStore() {
  const context = useContext(OrderStoreContext);
  if (context === undefined) {
    throw new Error('useOrderStore must be used within an OrderStoreProvider');
  }
  return context;
}
