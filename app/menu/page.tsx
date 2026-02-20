'use client';

import { useState, useEffect } from 'react';

// 定義資料格式
interface Product {
  id: string | number;
  name: string;
  description: string;
  process: string;
  country: string;
  options: { variant: string; price: number }[];
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 獨立抓取豆單資料
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/checkout?action=getProducts', { cache: 'no-store' });
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const mappedProducts: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            process: item.process || '精選製程',
            country: item.country || '嚴選產地',
            options: item.options || []
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('抓取豆單失敗:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // 讀取中的畫面
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-900 border-t-transparent mb-4"></div>
          <p className="text-stone-500 font-bold tracking-widest">載入雲端豆單中...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4 font-sans text-stone-900">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-100">
        {/* 標題區 */}
        <div className="p-10 bg-stone-900 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-wide">老王精品文字豆單</h1>
          <p className="text-xs text-stone-400 font-bold tracking-[0.3em] uppercase">Neighbor Old Wang Selection</p>
        </div>

        {/* 列表區 */}
        <div className="p-8 md:p-12 space-y-12">
          {products.map((p, idx) => (
            <div key={idx} className="group relative pl-6 border-l-4 border-stone-200 hover:border-amber-500 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-stone-100 text-stone-500 text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-wider">{p.country}</span>
                <span className="text-amber-600 text-xs font-black uppercase tracking-widest">{p.process}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-black text-stone-800 group-hover:text-amber-700 transition-colors">{p.name}</h2>
                <div className="flex flex-col items-start md:items-end bg-stone-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                  {p.options.map((opt, i) => (
                    <span key={i} className="text-sm font-black text-stone-900 leading-relaxed">
                      {opt.variant} · NT$ {opt.price}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-stone-500 text-sm leading-relaxed font-medium">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* 頁尾 */}
        <div className="p-6 bg-stone-100 text-center border-t border-stone-200">
          <p className="text-stone-400 text-[10px] font-bold tracking-[0.3em] uppercase">Freshly Roasted in Taipei · Neighbor Old Wang</p>
        </div>
      </div>
    </main>
  );
}