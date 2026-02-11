'use client'; // 🔥 這行很重要，代表這是負責互動的元件

import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import { notFound } from 'next/navigation';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  status: string;
  options: any[];
  process: string;
  country: string;
  flavorNotes: string[];
}

// 接收從 page.tsx 傳下來的 id
export default function ProductClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GAS_URL;
        // 加上 { cache: 'no-store' } 確保資料最新
        const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getProducts`, { cache: 'no-store' });
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // 注意：這裡做寬鬆比對 (==)，因為 id 可能是數字或字串
          const found = data.find((p: any) => p.id == id);
          if (found) {
            setProduct({
              ...found,
              image: found.image || 'https://via.placeholder.com/400x300?text=No+Image'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-300 border-t-amber-700"></div>
          <p className="mt-4 text-stone-500 font-bold tracking-widest">職人手沖準備中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      {/* 頂部導航 (這裡不放 Navbar，因為 Layout 已經有了) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-bold text-sm tracking-wide">回到豆單</span>
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* 左側：商品圖片 (Sticky) */}
          <div className="relative">
            <div className="sticky top-28 aspect-square rounded-2xl overflow-hidden shadow-2xl bg-stone-200 group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-extrabold text-stone-900 shadow-sm tracking-wider">
                  {product.category}
                 </span>
                 <span className="bg-stone-900/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-extrabold text-white shadow-sm tracking-wider">
                  {product.process}
                 </span>
              </div>
            </div>
          </div>

          {/* 右側：商品資訊與購買 */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 text-amber-700 font-bold text-sm tracking-widest uppercase">
                <span>{product.country}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="prose prose-stone prose-lg text-stone-600 mb-8 leading-relaxed">
                {product.description}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-8">
               <ProductForm product={product} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}