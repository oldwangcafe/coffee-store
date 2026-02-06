'use client';

import { PRODUCTS } from '../../data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts';

// --- 雷達圖元件 ---
const FlavorRadar = ({ data }: { data: any }) => {
  // ✅ 這裡就是關鍵的防呆機制！
  // 如果資料還沒準備好，就顯示文字，這樣網頁才不會炸開
  if (!data) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-stone-50 rounded-xl text-stone-400 text-sm">
        此豆種尚無風味數據
      </div>
    );
  }

  const chartData = [
    { subject: '酸度', A: data.acidity, fullMark: 5 },
    { subject: '甜度', A: data.sweetness, fullMark: 5 },
    { subject: '苦度', A: data.bitterness, fullMark: 5 },
    { subject: '厚度', A: data.body, fullMark: 5 },
    { subject: '餘韻', A: data.aftertaste, fullMark: 5 },
  ];

  return (
    <div className="w-full h-[300px] -ml-6">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#78716c', fontSize: 14, fontWeight: 'bold' }} 
          />
          <Radar
            name="Flavor"
            dataKey="A"
            stroke="#d97706"
            strokeWidth={3}
            fill="#d97706"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 主頁面 ---
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* 上方導航 */}
        <div className="p-6 border-b border-stone-100">
          <Link href="/" className="text-stone-500 hover:text-stone-900 flex items-center gap-2 text-sm font-bold transition-colors">
            ← 回豆單列表
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 左側：大圖 */}
          <div className="h-96 md:h-full bg-stone-200 relative">
             <img 
               src={product.imageUrl} 
               alt={product.name} 
               className="w-full h-full object-cover"
             />
             <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 px-3 py-1 rounded text-sm font-bold text-stone-800 shadow-sm inline-block self-start">
                  {product.roastLevel}
                </span>
                <span className="bg-stone-900/90 px-3 py-1 rounded text-sm font-bold text-white shadow-sm inline-block self-start">
                  {product.process}
                </span>
             </div>
          </div>

          {/* 右側：詳細資訊 */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="text-sm text-amber-700 font-bold mb-2 uppercase tracking-widest">
              {product.country} · {product.region}
            </div>
            <h1 className="text-4xl font-extrabold text-stone-900 mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
               {product.flavorNotes.map(note => (
                 <span key={note} className="px-3 py-1 bg-amber-50 text-amber-800 text-sm font-medium rounded-full border border-amber-100">
                   {note}
                 </span>
               ))}
            </div>

            {/* 🔥 雷達圖放在這裡 🔥 */}
            <div className="mb-6 border-b border-stone-100 pb-6">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">風味分析</h3>
              {/* 傳入 data 時，程式會自動檢查裡面有沒有東西 */}
              <FlavorRadar data={product.flavorProfile} />
            </div>

            <h3 className="text-lg font-bold text-stone-800 mb-2">杯測筆記</h3>
            <p className="text-stone-600 leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            <div className="mt-auto border-t border-stone-100 pt-8">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <p className="text-sm text-stone-400 mb-1">售價</p>
                    <span className="text-4xl font-bold text-stone-900">NT$ {product.price}</span>
                 </div>
              </div>
              
              <a 
                href="https://myship.7-11.com.tw/" 
                target="_blank"
                rel="noopener noreferrer" 
                className="block w-full text-center bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                前往 7-11 賣貨便購買
              </a>
              <p className="text-center text-xs text-stone-400 mt-3">
                *點擊後將開啟新視窗進行結帳
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}