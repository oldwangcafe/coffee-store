'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-stone-100">
        {/* 成功圖示 */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-stone-800 mb-2">訂單成立！</h1>
        <p className="text-stone-500 mb-8">感謝您的購買，我們將盡快為您烘焙與出貨。</p>

        {/* 訂單資訊卡片 */}
        <div className="bg-stone-50 rounded-xl p-6 mb-8 text-left border border-stone-100">
          <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1">訂單編號</p>
          <p className="text-xl font-mono font-bold text-stone-800 select-all">{orderId || '處理中...'}</p>
          <p className="text-xs text-stone-400 mt-2">請截圖保存，方便日後查詢。</p>
        </div>

        {/* 按鈕區 */}
        <div className="space-y-3">
          <Link 
            href="/" 
            className="block w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
          >
            回到首頁
          </Link>
          <Link 
            href="/products" 
            className="block w-full bg-white text-stone-600 font-bold py-4 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
          >
            繼續逛逛
          </Link>
        </div>
      </div>
    </div>
  );
}

// Next.js 規範：使用 useSearchParams 需要包在 Suspense 裡
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">載入中...</div>}>
      <SuccessContent />
    </Suspense>
  );
}