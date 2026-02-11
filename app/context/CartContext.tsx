'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string; // 規格 (200g / 濾掛)
  form?: string;    // 🔥 新增：型態 (咖啡豆 / 咖啡粉)
  grind?: string;   // 🔥 新增：研磨度 (手沖、義式...)
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number, variant?: string, form?: string, grind?: string) => void;
  updateQuantity: (id: string | number, quantity: number, variant?: string, form?: string, grind?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      // 🔥 修正：比對商品時，連同「型態」和「研磨度」一起比對
      const existingItem = currentItems.find(
        item => item.id === newItem.id && 
                item.variant === newItem.variant &&
                item.form === newItem.form &&
                item.grind === newItem.grind
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id && 
          item.variant === newItem.variant &&
          item.form === newItem.form &&
          item.grind === newItem.grind
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (id: string | number, variant?: string, form?: string, grind?: string) => {
    setItems(currentItems => currentItems.filter(
      item => !(item.id === id && item.variant === variant && item.form === form && item.grind === grind)
    ));
  };

  const updateQuantity = (id: string | number, quantity: number, variant?: string, form?: string, grind?: string) => {
    if (quantity < 1) return;
    setItems(currentItems => currentItems.map(item =>
      item.id === id && item.variant === variant && item.form === form && item.grind === grind
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 1000 ? 0 : 60;
  const totalAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      shippingFee,
      totalAmount
    }}>
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