'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// 1. 定義資料格式
interface Product {
  id: string | number;
  name: string;
  price: number;
  imageUrl: string;
  roastLevel: string;
  description: string;
  process: string;
  country: string;
  options: { variant: string; price: number }[];
}

const STANDARD_PROCESSES = ['水洗', '日曬', '蜜處理', '特殊處理'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 移除了原本的 isMenuOpen 狀態
  
  const [selectedRoast, setSelectedRoast] = useState<string | '全部'>('全部');
  const [selectedProcess, setSelectedProcess] = useState<string | '全部'>('全部');

  // 2. 抓取資料
  useEffect(() => {
    async function fetchMenu() {
      try {
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
            options: item.options || []
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

  const allProcesses = useMemo(() => {
    const existingProcesses = Array.from(new Set(products.map(p => p.process)));
    const extraProcesses = existingProcesses.filter(p => !STANDARD_PROCESSES.includes(p));
    return ['全部', ...STANDARD_PROCESSES, ...extraProcesses];
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchRoast = selectedRoast === '全部' || product.roastLevel === selectedRoast;
    const matchProcess = selectedProcess === '全部' || product.process === selectedProcess;
    return matchRoast && matchProcess;
  });

  const scrollToProducts = () => {
    document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Hero Banner */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="/hero-bg.jpg" alt="隔壁老王職人手沖" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-50"></div>
        </div>
        <div className="relative z-10 text-center px-4 mt-12">
          <span className="inline-block text-amber-400 font-medium tracking-[0.3em] mb-4 text-sm uppercase">PRECISION ROASTING LAB</span>
          <h2 className="text-white text-5xl md:text-7xl font-extrabold mb-6">隔壁老王咖啡</h2>
          <p className="text-stone-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            用 20 年程式邏輯開發，控溫每一條烘焙曲線<br/>
            讓每一杯咖啡，都如同程式碼般精確且純粹
          </p>
          <button onClick={scrollToProducts} className="border-2 border-white text-white py-4 px-10 rounded-full font-bold hover:bg-white hover:text-stone-900 transition-all">
            探索今日豆單
          </button>
        </div>
      </div>

      <div id="product-section" className="max-w-6xl mx-auto p-6 scroll-mt-20">
        <div className="my-12 text-center">
          <h2 className="text-3xl font-bold mb-4">本月精選豆單</h2>
          <p className="text-stone-500">自家烘焙 · 新鮮直送 · 極致風味</p>
        </div>

        {/* 篩選器與 [查看豆單] 按鈕 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex flex-wrap gap-8 items-end">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-3">焙度篩選</label>
              <div className="flex flex-wrap gap-2">
                {['全部', '淺焙', '中焙', '中深焙', '深焙'].map(level => (
                  <button key={level} onClick={() => setSelectedRoast(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedRoast === level ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-3">處理法</label>
              <select onChange={(e) => setSelectedProcess(e.target.value)} value={selectedProcess} className="w-auto min-w-[160px] pl-4 pr-10 py-2.5 bg-stone-100 rounded-lg text-sm font-bold outline-none cursor-pointer">
                {allProcesses.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* 🔥 修改處：改成 Link 並加上 target="_blank" 另開分頁 */}
          <Link 
            href="/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-stone-900 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-stone-200"
          >
            📜 另開視窗查看文字豆單
          </Link>
        </div>

        {/* 商品卡片列表 */}
        {loading ? (
           <div className="text-center py-20">正在同步雲端豆單...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <Link key={product.id} href={`/products/${product.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 group-hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="h-48 overflow-hidden"><img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" /></div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-amber-700 font-bold mb-1">{product.country} · {product.process}</div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-stone-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-stone-400 font-bold">NT$ {product.price} 起</span>
                      <span className="px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-lg group-hover:bg-stone-700">查看詳情</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* 🔥 原本在最下方的 Modal 已經被徹底移除 */}
    </main>
  );
}