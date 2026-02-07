'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS, RoastLevel } from './data'; 

export default function Home() {
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel | '全部'>('全部');
  const [selectedProcess, setSelectedProcess] = useState<string | '全部'>('全部');

  const allProcesses = useMemo(() => 
    ['全部', ...Array.from(new Set(PRODUCTS.map(p => p.process)))], 
  []);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchRoast = selectedRoast === '全部' || product.roastLevel === selectedRoast;
    const matchProcess = selectedProcess === '全部' || product.process === selectedProcess;
    return matchRoast && matchProcess;
  });

  const scrollToProducts = () => {
    const productSection = document.getElementById('product-section');
    productSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      {/* Hero Banner (職人形象區) */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* 背景圖與動畫 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/hero-bg.jpg" 
            alt="隔壁老王職人手沖" 
            className="w-full h-full object-cover opacity-70 scale-100 transition-transform duration-[20s]"
            style={{
              animation: 'slowZoom 20s ease-in-out infinite alternate'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-50"></div>
        </div>

        {/* CSS 動畫定義 */}
        <style jsx global>{`
          @keyframes slowZoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.15); }
          }
        `}</style>

        {/* Banner 文字內容 */}
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
          <h2 className="text-3xl font-bold mb-4 text-stone-800">本月精選豆單</h2>
          <p className="text-stone-500">自家烘焙 · 新鮮直送 · 極致風味</p>
        </div>

        {/* 篩選器區塊 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-8">
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">焙度篩選</label>
              <div className="flex flex-wrap gap-2">
                {['全部', '淺焙', '中焙', '中深焙', '深焙'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedRoast(level as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedRoast === level 
                        ? 'bg-stone-800 text-white shadow-md' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">處理法</label>
              <select 
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="px-4 py-2 bg-stone-100 border-none rounded-lg text-sm font-medium text-stone-700 focus:ring-2 focus:ring-stone-500 outline-none"
              >
                {allProcesses.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 商品列表 */}
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
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-stone-800 shadow-sm">
                    {product.roastLevel}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-amber-700 font-bold tracking-wide mb-1">
                    {product.country} · {product.process}
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone-500 mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.flavorNotes.map(note => (
                      <span key={note} className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-md">
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* 價格與按鈕 */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-stone-400">200g / 濾掛</span>
                      <span className="text-xl font-bold text-stone-900">
                        NT$ {product.price} <span className="text-sm font-normal text-stone-500">起</span>
                      </span>
                    </div>
                    
                    <span className="px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg group-hover:bg-stone-700 transition-colors">
                      查看詳情
                    </span>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}