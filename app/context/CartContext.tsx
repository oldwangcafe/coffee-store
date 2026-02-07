'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { CoffeeProduct } from '../data'; // 這行如果沒用到可以註解掉

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variant: '200g' | '濾掛(10入)';
  form?: '咖啡豆' | '咖啡粉';
  grind?: '手沖' | '美式' | '義式';
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔥 1. 初始化：從 localStorage 讀取舊資料
  useEffect(() => {
    const savedCart = localStorage.getItem('neighbor-wang-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('解析購物車資料失敗', e);
      }
    }
    setIsInitialized(true); // 標記為已初始化
  }, []);

  // 🔥 2. 監聽：當購物車改變時，寫入 localStorage
  useEffect(() => {
    // 只有當初始化完成後，才開始寫入 (避免一開始的空陣列把舊資料蓋掉)
    if (isInitialized) {
      localStorage.setItem('neighbor-wang-cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // 加入購物車
  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(item => 
        item.productId === newItem.productId && 
        item.variant === newItem.variant &&
        item.form === newItem.form &&
        item.grind === newItem.grind
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += newItem.quantity;
        return newItems;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => prev.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };
  
  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 1000 ? 0 : 60;
  const totalAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartCount, subtotal, shippingFee, totalAmount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}