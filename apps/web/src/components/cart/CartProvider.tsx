'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Size } from '@clapculture/shared';
import { generateOrderId } from '@/lib/utils';

export interface ShippingCalculation {
  fee: number;
  isFree: boolean;
  reason: 'all_free' | 'threshold' | 'custom' | 'standard';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: Size, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getShippingFee: (threshold?: number, defaultFee?: number) => ShippingCalculation;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage only after component mounts on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem('clapculture_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage only after initial client hydration
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('clapculture_cart', JSON.stringify(items));
      } catch (err) {
        console.error('Failed to save cart to localStorage', err);
      }
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, size: Size, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                freeShipping: product.freeShipping,
                deliveryChargeEnabled: product.deliveryChargeEnabled,
                deliveryFee: product.deliveryFee,
              }
            : item
        );
      }
      const newItem: CartItem = {
        id: generateOrderId(),
        productId: product.id,
        name: product.name,
        image: product.images[0] || '',
        size,
        price: product.price,
        quantity,
        freeShipping: product.freeShipping || false,
        deliveryChargeEnabled: product.deliveryChargeEnabled || false,
        deliveryFee: typeof product.deliveryFee === 'number' ? product.deliveryFee : undefined,
      };
      return [...prev, newItem];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const getCartTotal = () => items.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () => items.reduce((count, item) => count + item.quantity, 0);

  const getShippingFee = (threshold = 999, defaultFee = 49): ShippingCalculation => {
    if (items.length === 0) {
      return { fee: 0, isFree: true, reason: 'all_free' };
    }

    // 1. If ALL items in cart have freeShipping: true
    const allFreeShipping = items.every((item) => item.freeShipping === true);
    if (allFreeShipping) {
      return { fee: 0, isFree: true, reason: 'all_free' };
    }

    // 2. If any items have custom delivery charge enabled
    const itemsWithCustomFee = items.filter(
      (item) => item.deliveryChargeEnabled && typeof item.deliveryFee === 'number' && item.deliveryFee > 0
    );
    if (itemsWithCustomFee.length > 0) {
      const maxCustomFee = Math.max(...itemsWithCustomFee.map((i) => i.deliveryFee || 0));
      return { fee: maxCustomFee, isFree: false, reason: 'custom' };
    }

    // 3. Store threshold policy (Free above threshold, otherwise default shipping fee)
    const subtotal = getCartTotal();
    if (subtotal >= threshold) {
      return { fee: 0, isFree: true, reason: 'threshold' };
    }

    return { fee: defaultFee, isFree: false, reason: 'standard' };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getShippingFee,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
