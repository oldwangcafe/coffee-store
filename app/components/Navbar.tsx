'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { totalItems } = useCart(); // 1. 取得購物車總數量
  const [mounted, setMounted] = useState(false);

  // 2. 等待網頁載入完成 (避免數字閃爍)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-stone-900 border-b border-stone-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo 區 */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-900 font-bold text-xl group-hover:bg-amber-500 transition-colors">
              咖
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-wider group-hover:text-amber-500 transition-colors">
                隔壁老王咖啡
              </span>
              <span className="text-[10px] text-stone-400 tracking-[0.2em] uppercase">
                Coffee Roaster
              </span>
            </div>
          </Link>

          {/* 購物車按鈕 */}
          <Link href="/cart" className="relative p-3 rounded-full hover:bg-stone-800 transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-stone-300 group-hover:text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            
            {/* 🔥 3. 紅色數字球邏輯：只有大於 0 才顯示 */}
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-stone-900 animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>

          <Link href="/order-tracking" className="text-stone-600 hover:text-amber-600 font-bold transition-colors">
              查訂單
          </Link>

        </div>
      </div>
    </nav>
  );
}