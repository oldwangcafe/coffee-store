'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    cartCount, 
    subtotal, 
    shippingFee, 
    totalAmount 
  } = useCart();

  // 如果購物車是空的
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="text-stone-300 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-4">購物車是空的</h2>
        <p className="text-stone-500 mb-8">看起來你還沒選購任何咖啡豆</p>
        <Link href="/" className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-700 transition-colors">
          前往選購
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          購物車 
          <span className="text-lg font-normal text-stone-500 bg-stone-200 px-3 py-1 rounded-full">{cartCount} 件商品</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 左側：商品列表 */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-6 space-y-6">
              {items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                  {/* 商品圖片 */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* 商品資訊 */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-stone-800">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(index)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* 規格標籤 */}
                    <div className="flex flex-wrap gap-2 mb-4 text-sm text-stone-600">
                      <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">
                        {item.variant}
                      </span>
                      {item.variant === '200g' && (
                        <>
                          <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">
                            {item.form}
                          </span>
                          {item.form === '咖啡粉' && (
                            <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200 text-amber-700">
                              研磨：{item.grind}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* 數量調整 */}
                      <div className="flex items-center border border-stone-300 rounded-lg">
                        <button onClick={() => updateQuantity(index, -1)} className="px-3 py-1 hover:bg-stone-100 text-stone-600">-</button>
                        <span className="px-3 py-1 font-bold text-stone-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)} className="px-3 py-1 hover:bg-stone-100 text-stone-600">+</button>
                      </div>
                      <div className="font-bold text-lg text-stone-900">
                        NT$ {item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-stone-50 border-t border-stone-100 text-right">
              <Link href="/" className="text-sm text-stone-500 hover:text-stone-900 underline">
                ← 繼續購物
              </Link>
            </div>
          </div>

          {/* 右側：訂單摘要 */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-stone-900 mb-6">訂單摘要</h3>
              
              <div className="space-y-3 mb-6 border-b border-stone-100 pb-6">
                <div className="flex justify-between text-stone-600">
                  <span>小計</span>
                  <span>NT$ {subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>運費 (7-11 取貨)</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-bold">免運費</span>
                  ) : (
                    <span>NT$ {shippingFee}</span>
                  )}
                </div>
                {shippingFee > 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    還差 NT$ {1000 - subtotal} 即可免運
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-stone-800">總金額</span>
                <span className="text-3xl font-bold text-amber-700">NT$ {totalAmount}</span>
              </div>

              {/* 🔥 這裡就是剛剛改的地方，現在已經修復了 */}
              <Link 
                href="/checkout"
                className="block w-full text-center bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-700 transition-all shadow-lg active:scale-95"
              >
                前往結帳
              </Link>
              
              <p className="text-center text-xs text-stone-400 mt-4">
                支援 7-11 超商取貨付款
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}