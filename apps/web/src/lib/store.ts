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
  trackingNumber?: string;
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
  const [checkoutInfo, setCheckoutInfoState] = useState<CheckoutInfo>(() => {
    if (typeof window === 'undefined') return emptyCheckoutInfo;
    try {
      const stored = sessionStorage.getItem('cc_checkout');
      return stored ? JSON.parse(stored) : emptyCheckoutInfo;
    } catch {
      return emptyCheckoutInfo;
    }
  });

  const [orders, setOrders] = useState<OrderData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = sessionStorage.getItem('cc_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem('cc_current_order');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist to sessionStorage on changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('cc_checkout', JSON.stringify(checkoutInfo));
      } catch (e) {
        console.error('Failed to save checkoutInfo:', e);
      }
    }
  }, [checkoutInfo]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('cc_orders', JSON.stringify(orders));
      } catch (e) {
        console.error('Failed to save orders:', e);
      }
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (currentOrder) {
          sessionStorage.setItem('cc_current_order', JSON.stringify(currentOrder));
        } else {
          sessionStorage.removeItem('cc_current_order');
        }
      } catch (e) {
        console.error('Failed to save currentOrder:', e);
      }
    }
  }, [currentOrder]);

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
    const clean = orderId.replace('#', '').trim();
    const found = orders.find((o) => o.orderId.replace('#', '').trim() === clean);
    if (found) return found;
    if (currentOrder && currentOrder.orderId.replace('#', '').trim() === clean) {
      return currentOrder;
    }
    return null;
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
