'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext'; // 注意路徑：回到上一層找 app

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="bg-stone-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* 左側：品牌名稱 (點擊回首頁) */}
        <Link href="/" className="text-xl font-bold tracking-wider hover:text-amber-400 transition-colors">
          隔壁老王咖啡
        </Link>
        
        {/* 右側：選單與購物車 */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors hidden sm:block">
            所有商品
          </Link>
          <button className="hover:text-amber-400 transition-colors hidden sm:block">
            關於老王
          </button>

          {/* 🔥 購物車按鈕 */}
          <Link href="/cart" className="relative group flex items-center gap-2 hover:text-amber-400 transition-colors">
            <span className="sr-only">購物車</span>
            {/* 購物車圖示 SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            
            {/* 數量小紅點 (只有數量 > 0 才顯示) */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center shadow-sm animate-bounce-short">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}