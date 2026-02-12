'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// 定義資料格式
interface Product {
  id: string | number;
  name: string;
  price: number;
  imageUrl: string;
  roastLevel: string;
  description: string;
  process: string;
  country: string;
  flavorNotes: string[];
}

// 🔥 定義標準分類順序
const STANDARD_PROCESSES = ['水洗', '日曬', '蜜處理', '特殊處理'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 篩選器狀態
  const [selectedRoast, setSelectedRoast] = useState<string | '全部'>('全部');
  const [selectedProcess, setSelectedProcess] = useState<string | '全部'>('全部');

  // 1. 抓取資料
  useEffect(() => {
    async function fetchMenu() {
      try {
        const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GAS_URL;
        
        //const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getProducts`, { cache: 'no-store' });
        //const data = await res.json();
        // 這樣由伺服器幫你去跟 Google 拿菜單，瀏覽器就不會報錯了
       const res = await fetch('/api/checkout?action=getProducts', { cache: 'no-store' });
       
       const data = await res.json();
        
        if (Array.isArray(data)) {
          const mappedProducts: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.image || 'https://via.placeholder.com/400x300?text=No+Image',
            roastLevel: item.category || '中焙',
            description: item.description,
            process: item.process || '精選製程',
            country: item.country || '嚴選產地',
            flavorNotes: item.flavorNotes || []
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('抓取菜單失敗:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  // 2. 優化處理法列表邏輯
  const allProcesses = useMemo(() => {
    const existingProcesses = Array.from(new Set(products.map(p => p.process)));
    const extraProcesses = existingProcesses.filter(p => !STANDARD_PROCESSES.includes(p));
    return ['全部', ...STANDARD_PROCESSES, ...extraProcesses];
  }, [products]);

  // 3. 篩選邏輯
  const filteredProducts = products.filter(product => {
    const matchRoast = selectedRoast === '全部' || product.roastLevel === selectedRoast;
    const matchProcess = selectedProcess === '全部' || product.process === selectedProcess;
    return matchRoast && matchProcess;
  });

  const scrollToProducts = () => {
    const productSection = document.getElementById('product-section');
    productSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Hero Banner */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
  src="/hero-bg.jpg"   // 🔥 只要檔名對，這裡就讀得到
  alt="隔壁老王職人手沖" 
  className="w-full h-full object-cover opacity-70 scale-100 transition-transform duration-[20s]"
  style={{ animation: 'slowZoom 20s ease-in-out infinite alternate' }}
/>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-50"></div>
        </div>

        <style jsx global>{`
          @keyframes slowZoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.15); }
          }
        `}</style>

        <div className="relative z-10 text-center px-4 mt-12">
          <span className="inline-block text-amber-400 font-medium tracking-[0.3em] mb-4 text-sm md:text-base">
            PRECISION ROASTING LAB
          </span>
          <h2 className="text-white text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            隔壁老王咖啡
          </h2>
          <p className="text-stone-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            用 20 年程式邏輯開發，控溫每一條烘焙曲線
            <br/>
            讓每一杯咖啡，都如同程式碼般精確且純粹
          </p>
          <button 
            onClick={scrollToProducts}
            className="group relative inline-flex items-center gap-2 bg-transparent border-2 border-white text-white text-lg font-bold py-4 px-10 rounded-full overflow-hidden hover:text-stone-900 transition-colors duration-300"
          >
            <span className="relative z-10">探索今日豆單</span>
            <div className="absolute inset-0 z-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      <div id="product-section" className="max-w-6xl mx-auto p-6 scroll-mt-20">
        <div className="my-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-stone-900">本月精選豆單</h2>
          <p className="text-stone-500">自家烘焙 · 新鮮直送 · 極致風味</p>
        </div>

        {/* 篩選器區塊 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-8">
          <div className="flex flex-wrap gap-8 items-end">
            
            {/* 焙度篩選 */}
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">焙度篩選</label>
              <div className="flex flex-wrap gap-2">
                {['全部', '淺焙', '中焙', '中深焙', '深焙'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedRoast(level as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      selectedRoast === level 
                        ? 'bg-stone-900 text-white shadow-md' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 🔥 處理法篩選 (彈性寬度修正版) */}
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">處理法</label>
              <div className="relative inline-block">
                <select 
                  onChange={(e) => setSelectedProcess(e.target.value)}
                  value={selectedProcess}
                  // 🔥 修改重點：w-auto (自動寬度) + min-w-[160px] (最小寬度) + pr-10 (留位子給箭頭)
                  className="appearance-none w-auto min-w-[160px] pl-4 pr-10 py-2.5 bg-stone-100 border-none rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-stone-500 outline-none cursor-pointer hover:bg-stone-200 transition-colors"
                >
                  {allProcesses.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {/* 箭頭 Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-stone-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 商品列表 */}
        {loading ? (
           <div className="text-center py-20">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
             <p className="mt-4 text-stone-500">正在同步雲端豆單...</p>
           </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-stone-500 bg-stone-100 rounded-xl">
            <p className="font-bold mb-2">沒有符合條件的咖啡豆</p>
            <button 
              onClick={() => {setSelectedRoast('全部'); setSelectedProcess('全部');}}
              className="text-amber-700 underline hover:text-amber-800"
            >
              清除篩選條件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <Link key={product.id} href={`/products/${product.id}`} className="block group h-full">
                <div className="bg-white rounded-xl overflow-hidden border border-stone-100 group-hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  
                  {/* 圖片區域 */}
                  <div className="h-48 bg-stone-200 relative overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                       <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-stone-800 shadow-sm">
                        {product.roastLevel}
                       </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-amber-700 font-bold tracking-wide mb-1">
                      {product.country} · {product.process}
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-500 mb-4 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    
                    {/* 價格與按鈕 */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-400 font-bold">NT$ {product.price} 起</span>
                      </div>
                      <span className="px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-lg group-hover:bg-stone-700 transition-colors">
                        查看詳情
                      </span>
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}