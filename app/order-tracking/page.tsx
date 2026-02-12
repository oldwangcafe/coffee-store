'use client';

import { useState } from 'react';

export default function OrderTrackingPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrders([]);

    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('⚠️ 格式錯誤：請輸入 10 碼手機號碼，並以 09 開頭');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/checkout?action=checkOrder&phone=${phone}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();

      if (res.ok && data.found && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setError(data.message || '🎉 目前沒有進行中的訂單 (可能已結案或號碼有誤)');
      }
    } catch (err: any) {
      console.error(err);
      setError('連線失敗：請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('查詢代碼已複製！');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* 頁首 */}
      <div className="bg-white px-4 py-10 border-b border-stone-200 mb-8 shadow-sm">
        <h1 className="text-3xl font-black text-stone-800 text-center flex items-center justify-center gap-3">
          <span className="text-4xl">🔍</span> 訂單進度查詢
        </h1>
        <p className="text-center text-stone-400 mt-2 font-medium font-sans">輸入手機號碼，掌握老王烘豆進度</p>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* 搜尋區塊 */}
        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-stone-200 mb-10">
          <form onSubmit={handleCheck} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-stone-400 mb-2 ml-1 uppercase tracking-widest">
                訂購手機號碼
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                placeholder="0912345678"
                className="w-full p-5 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-stone-800 focus:ring-0 outline-none text-2xl font-mono font-black text-stone-900 placeholder-stone-300 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white font-black py-5 rounded-2xl hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50 text-xl shadow-xl shadow-stone-200"
            >
              {loading ? '正在連線 Excel...' : '立即查詢訂單'}
            </button>
          </form>
          
          {error && (
            <div className="mt-5 p-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold text-center border border-amber-100">
              {error}
            </div>
          )}
        </div>

        {/* 訂單列表 */}
        <div className="space-y-8">
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200 overflow-hidden border border-stone-100">
              
              {/* 卡片頂部 */}
              <div className="p-7 bg-stone-900 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">目前狀態</span>
                    <p className={`text-2xl font-black mt-1 ${
                      order.status.includes('出貨') || order.status.includes('送達') ? 'text-green-400' : 'text-amber-400'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">訂單編號</span>
                    <p className="text-xs font-mono font-bold mt-1 text-stone-300">{order.orderId}</p>
                  </div>
                </div>
              </div>

              {/* 卡片內容區 */}
              <div className="p-7 space-y-6">
                
                {/* 🚚 物流區塊 */}
                {order.trackingNumber && (
                  <div className="bg-green-50 border-2 border-green-100 p-6 rounded-[2rem]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-green-800 font-bold text-sm flex items-center gap-2">
                        <span className="text-xl">🚚</span> 7-11 物流狀態
                      </span>
                      <button 
                        onClick={() => copyToClipboard(order.trackingNumber)}
                        className="text-[10px] bg-green-200 text-green-900 px-3 py-1.5 rounded-full font-black hover:bg-green-300 active:scale-90 transition-all"
                      >
                        複製單號
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-green-700 font-bold opacity-60 mb-1 uppercase">物流查詢代碼 (J 欄)</p>
                        <p className="text-3xl font-mono font-black text-stone-800 tracking-tighter">
                          {order.trackingNumber}
                        </p>
                      </div>
                      
                      <a 
                        href={`https://eservice.7-11.com.tw/E-Tracking/search.aspx?CRM_PaymentNo=${order.trackingNumber}&FLAG=12&FROM=C2CPlatform&returnuri=https://myship.7-11.com.tw/seller/order/All`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-[#008000] text-white font-black py-4 rounded-2xl hover:bg-[#006400] transition-all shadow-lg active:scale-95 text-lg"
                      >
                        <span>前往 7-11 官網查進度</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {/* 訂單基本資訊 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-stone-50 p-4 rounded-2xl">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">訂購日期</span>
                    <span className="text-stone-800 font-black">{order.date}</span>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-2xl text-right">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">總金額</span>
                    <span className="text-stone-900 font-black text-xl">NT$ {order.total}</span>
                  </div>
                </div>

                {/* 購買品項 */}
                <div className="pt-2">
                  <span className="text-[10px] text-stone-400 font-bold block mb-3 uppercase tracking-widest ml-1">訂購品項摘要</span>
                  <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                    <pre className="text-sm text-stone-700 whitespace-pre-wrap font-sans leading-relaxed font-medium">
                      {order.items}
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* 卡片底部 */}
              <div className="p-4 bg-stone-50 text-center">
                <p className="text-[10px] text-stone-300 font-bold italic tracking-widest">隔壁老王咖啡烘焙所 Neighbor Old Wang Coffee</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center pb-10">
          <p className="text-stone-400 text-sm font-bold font-sans">如有疑問，請直接私訊老王</p>
        </div>
      </div>
    </div>
  );
}