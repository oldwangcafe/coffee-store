'use client';

import { useState, useMemo } from 'react';

// --- 1. 定義資料結構 (已修正：加入 imageUrl) ---
type RoastLevel = '淺焙' | '中焙' | '中深焙' | '深焙';

interface CoffeeProduct {
  id: string;
  name: string;
  country: string;
  region: string;
  process: string;
  roastLevel: RoastLevel;
  price: number;
  flavorNotes: string[];
  description: string;
  imageUrl: string; 
}

// --- 2. 假資料 (請確保每筆資料都有 imageUrl) ---
const MOCK_PRODUCTS: CoffeeProduct[] = [
  {
    id: '1',
    name: '衣索比亞 耶加雪菲 沃卡',
    country: '衣索比亞',
    region: '耶加雪菲',
    process: '水洗',
    roastLevel: '淺焙',
    price: 450,
    flavorNotes: ['柑橘', '茉莉花', '蜂蜜'],
    description: '經典的耶加雪菲風味，酸值明亮，口感乾淨。',
    imageUrl: '/coffee-beans/yirgacheffe.jpg' // 確保這裡的路徑對應到你 public 資料夾內的檔案
  },
  {
    id: '2',
    name: '哥倫比亞 天堂莊園',
    country: '哥倫比亞',
    region: '考卡',
    process: '雙重厭氧',
    roastLevel: '中焙',
    price: 550,
    flavorNotes: ['草莓優格', '熱帶水果', '酒香'],
    description: '強烈的特殊處理法風味，適合喜歡嚐鮮的你。',
    imageUrl: '/coffee-beans/colombia.jpg'
  },
  {
    id: '3',
    name: '印尼 黃金曼特寧',
    country: '印尼',
    region: '蘇門答臘',
    process: '濕剝法',
    roastLevel: '深焙',
    price: 400,
    flavorNotes: ['仙草', '黑巧克力', '奶油'],
    description: '厚實醇厚，不酸的老饕首選。',
    imageUrl: '/coffee-beans/mandheling.jpg'
  }
];

// --- 3. 主頁面元件 ---
export default function Home() {
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel | '全部'>('全部');
  const [selectedProcess, setSelectedProcess] = useState<string | '全部'>('全部');

  const allProcesses = useMemo(() => 
    ['全部', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.process)))], 
  []);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchRoast = selectedRoast === '全部' || product.roastLevel === selectedRoast;
    const matchProcess = selectedProcess === '全部' || product.process === selectedProcess;
    return matchRoast && matchProcess;
  });

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <nav className="bg-stone-900 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">隔壁老王咖啡</h1>
          <div className="space-x-4 text-sm">
            <button className="hover:text-amber-400">所有商品</button>
            <button className="hover:text-amber-400">關於老王</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="my-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-stone-800">本月精選豆單</h2>
          <p className="text-stone-500">自家烘焙 · 新鮮直送 · 極致風味</p>
        </div>

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
            <div key={product.id} className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-300 flex flex-col">
              
              {/* --- 圖片區域 --- */}
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

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                  <span className="text-xl font-bold text-stone-900">
                    NT$ {product.price}
                  </span>
                  
                  {/* 按鈕：直接跳轉到賣貨便 */}
                  <a 
                    href="https://myship.7-11.com.tw/" // 這裡之後換成你的賣場連結
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    購買
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}