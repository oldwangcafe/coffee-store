// ❌ 這裡千萬不能有 'use client'
// 這支檔案專門負責 SEO 和傳遞 ID

import type { Metadata, ResolvingMetadata } from 'next';
import ProductClient from './ProductClient'; // 引入剛剛分出去的 UI 元件

type Props = {
  params: Promise<{ id: string }> // Next.js 15+ 的寫法
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 🔥 SEO 設定區 (伺服器端執行)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 等待參數解析 (Next.js 15+ 需要 await)
  const { id } = await params;

  const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GAS_URL || '';
  
  try {
// 1. 先從 API 抓取資料
const res = await fetch('/api/checkout?action=getProducts', { cache: 'no-store' });

if (!res.ok) throw new Error('無法取得商品資料');

// 2. 先將資料轉為 JSON (這時候 data 才被定義)
const data = await res.json();

// 3. 接著才進行「尋找產品」的邏輯 (只宣告一次 const product)
const product = Array.isArray(data) 
  ? data.find((p: any) => p.id == id) 
  : null;

    if (!product) {
      return { title: '商品未找到 | 隔壁老王咖啡' }
    }

    const imageUrl = product.image || '/products/default.jpg'; 

    return {
      title: `${product.name} | 隔壁老王咖啡`,
      description: product.description?.substring(0, 100) || '20年程式職人的手沖咖啡',
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 60),
        images: [imageUrl],
        url: `/products/${id}`,
        type: 'website',
      },
    }
  } catch (error) {
    return {
      title: '隔壁老王咖啡',
      description: '自家烘焙 · 新鮮直送',
    }
  }
}

// 🔥 主頁面 (負責把 ID 傳給 ProductClient)
export default async function Page({ params }: Props) {
  const { id } = await params;
  
  // 這裡只負責渲染 Client Component，並把 ID 丟進去
  return <ProductClient id={id} />;
}