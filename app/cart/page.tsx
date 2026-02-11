'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, shippingFee, totalAmount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          🛒 您的購物車
          <span className="text-lg font-normal text-stone-600 bg-stone-200 px-3 py-1 rounded-full">{items.length} 件商品</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-stone-200">
            <p className="text-xl text-stone-800 mb-6 font-bold">購物車還是空的，來杯咖啡吧？</p>
            <Link href="/" className="inline-block bg-amber-700 text-white px-8 py-3 rounded-full hover:bg-amber-800 transition-colors font-bold shadow-lg">
              去逛逛豆單
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.variant}-${item.form}-${item.grind}-${idx}`} className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 flex gap-4 items-center">
                  
                  {/* 圖片 */}
                  <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                    <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* 資訊區 */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-stone-900">{item.name}</h3>
                    
                    {/* 🔥 修正：移除格子樣式，改用深色粗體字顯示 */}
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-sm font-bold text-amber-800">
                        {item.variant}
                      </span>
                      {item.form && item.form !== '無' && (
                        <span className="text-sm font-bold text-stone-700">
                           {item.form} {item.grind ? `— ${item.grind}` : ''}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 text-stone-900 font-mono font-bold">
                      NT$ {item.price}
                    </div>
                  </div>

                  {/* 數量 */}
                  <div className="flex items-center gap-3 bg-stone-100 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant, item.form, item.grind)}
                      className="w-8 h-8 rounded-md bg-white text-stone-900 font-bold shadow-sm hover:bg-stone-50"
                    >
                      -
                    </button>
                    <span className="font-mono w-6 text-center font-bold text-stone-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant, item.form, item.grind)}
                      className="w-8 h-8 rounded-md bg-white text-stone-900 font-bold shadow-sm hover:bg-stone-50"
                    >
                      +
                    </button>
                  </div>

                  {/* 移除 */}
                  <button 
                    onClick={() => removeFromCart(item.id, item.variant, item.form, item.grind)}
                    className="text-stone-400 hover:text-red-600 p-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200 sticky top-24">
                <h2 className="text-xl font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">訂單摘要</h2>
                <div className="space-y-3 mb-6 border-b border-stone-200 pb-6">
                  <div className="flex justify-between text-stone-800 font-medium">
                    <span>商品總計</span>
                    <span>NT$ {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>運費 (滿千免運)</span>
                    <span>{shippingFee === 0 ? '免運' : `NT$ ${shippingFee}`}</span>
                  </div>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-stone-900 mb-8">
                  <span>總金額</span>
                  <span>NT$ {totalAmount}</span>
                </div>
                
                <Link 
                  href="/checkout"
                  className="block w-full bg-stone-900 text-white text-center font-bold py-4 rounded-xl hover:bg-stone-700 transition-all shadow-lg active:scale-95 text-lg"
                >
                  前往結帳
                </Link>
                <Link 
                   href="/"
                   className="block w-full text-center text-stone-500 text-sm mt-4 hover:text-stone-800 font-medium"
                >
                  繼續選購
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}