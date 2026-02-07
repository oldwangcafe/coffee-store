'use client';

import { useState, useEffect, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams(); 
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    storeName: '',
    storeId: '',
    note: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 購物車檢查
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // 🔥 2. 關鍵修正：頁面載入時，同時還原「備份資料」與讀取「7-11 回傳資料」
  useEffect(() => {
    // A. 先試著讀取之前的備份
    const savedData = localStorage.getItem('checkout_backup');
    let initialData = savedData ? JSON.parse(savedData) : null;

    // B. 讀取網址上的門市資料 (7-11 傳回來的)
    const returnStoreId = searchParams.get('storeId');
    const returnStoreName = searchParams.get('storeName');

    if (initialData) {
      // 如果有備份，就用備份當基底
      setFormData(prev => {
        const newData = { ...prev, ...initialData };
        // 如果網址有新店名，就覆蓋掉備份裡的舊店名
        if (returnStoreName) {
          newData.storeId = returnStoreId || '';
          newData.storeName = returnStoreName || '';
        }
        return newData;
      });
    } else if (returnStoreName) {
      // 如果沒備份但有店名 (極少見，防呆用)，直接填店名
      setFormData(prev => ({
        ...prev,
        storeId: returnStoreId || '',
        storeName: returnStoreName || ''
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      items,
      totalAmount,
      buyer: formData,
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert('🎉 訂單已成功送出！老王會盡快與您聯繫確認！');
        
        // 🔥 成功送單後，記得清空備份，以免影響下一張單
        localStorage.removeItem('checkout_backup');
        
        clearCart();
        router.push('/');
      } else {
        alert(`訂單失敗：${result.error || '未知錯誤'}`);
      }
    } catch (error) {
      console.error('連線錯誤:', error);
      alert('網路連線發生問題，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectStore = () => {
    // 🔥 關鍵修正：跳轉前，先把目前填到一半的資料存起來！
    localStorage.setItem('checkout_backup', JSON.stringify(formData));

    const currentOrigin = window.location.origin; 
    const callbackUrl = `${currentOrigin}/api/store-callback`;
    const sevenElevenUrl = `https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&showtype=1&tempvar=&url=${encodeURIComponent(callbackUrl)}`;
    
    window.location.href = sevenElevenUrl;
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-8 text-center">結帳櫃檯</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 左側：填寫資料 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <span className="bg-stone-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              收件人資訊
            </h2>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">真實姓名 (取貨需核對證件)</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  placeholder="王小明"
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">手機號碼 (接收到貨簡訊)</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  placeholder="0912345678"
                  pattern="09[0-9]{8}"
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white"
                  onChange={handleChange}
                />
              </div>

              <div className="pt-6 border-t border-stone-100 mt-6">
                <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <span className="bg-stone-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                  7-11 門市資訊
                </h3>
                
                <div className="bg-amber-50 p-4 rounded-lg mb-4 border border-amber-100">
                  <p className="text-sm text-amber-800 mb-3 font-bold">
                    💡 點擊下方按鈕選擇門市：
                  </p>
                  <button
                    type="button"
                    onClick={handleSelectStore}
                    className="flex items-center justify-center w-full py-3 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-bold shadow-sm"
                  >
                    <img src="https://www.7-11.com.tw/images/logo.png" alt="7-11" className="h-5 mr-2" />
                    開啟 7-11 電子地圖選店
                  </button>
                  <p className="text-xs text-amber-600 mt-2">
                    * 選定後會自動跳轉回此頁面並填入店名。
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">門市名稱</label>
                    <input 
                      type="text" 
                      name="storeName"
                      required
                      readOnly
                      value={formData.storeName}
                      placeholder="請點擊上方按鈕選擇"
                      className="w-full p-3 border border-stone-300 rounded-lg bg-stone-100 text-stone-900 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">門市店號</label>
                    <input 
                      type="text" 
                      name="storeId"
                      readOnly
                      value={formData.storeId}
                      className="w-full p-3 border border-stone-300 rounded-lg bg-stone-100 text-stone-900 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-bold text-stone-700 mb-1">給老王的備註 (選填)</label>
                <textarea 
                  name="note"
                  rows={3}
                  value={formData.note}
                  placeholder="例如：請幫我不需研磨..."
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white"
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>

          {/* 右側：訂單確認 */}
          <div>
            <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-lg sticky top-24">
              <h2 className="text-xl font-bold mb-6">訂單內容確認</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm border-b border-stone-700 pb-4 last:border-0">
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-stone-400 text-xs mt-1">
                        {item.variant} 
                        {item.form && ` · ${item.form}`}
                        {item.grind && ` · ${item.grind}`}
                      </div>
                      <div className="text-stone-500 text-xs mt-1">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-mono">NT$ {item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-700 pt-4 space-y-2 mb-8">
                <div className="flex justify-between text-stone-300">
                  <span>小計</span>
                  <span>NT$ {subtotal}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>運費 (7-11 取貨付款)</span>
                  <span>{shippingFee === 0 ? '免運' : `NT$ ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold mt-4 pt-4 border-t border-stone-700">
                  <span>總金額</span>
                  <span>NT$ {totalAmount}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? '處理中...' : '確認送出訂單'}
              </button>
              
              <p className="text-center text-xs text-stone-500 mt-4">
                ⚠️ 注意：為防止惡意棄單，首次購買老王會先致電確認。
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-500 font-bold text-lg animate-pulse">
          正在準備結帳櫃檯...
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}