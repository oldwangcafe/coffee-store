'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CoffeeProduct } from '../../data';

export default function ProductForm({ product }: { product: CoffeeProduct }) {
  const { addToCart } = useCart();
  
  // 🛒 狀態管理：記錄客人的選擇
  const [variant, setVariant] = useState<'200g' | '濾掛(10入)'>('200g');
  const [form, setForm] = useState<'咖啡豆' | '咖啡粉'>('咖啡豆');
  const [grind, setGrind] = useState<'手沖' | '美式' | '義式'>('手沖');
  const [quantity, setQuantity] = useState(1);

  // 💰 價格邏輯 (如果濾掛包比較貴，可以在這裡加錢，目前設為同價)
  const currentPrice = variant === '濾掛(10入)' ? product.dripPrice : product.price;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
      imageUrl: product.imageUrl,
      variant,
      // 只有選 200g 才需要紀錄是豆還是粉
      form: variant === '200g' ? form : undefined,
      // 只有選 粉 才需要紀錄粗細
      grind: (variant === '200g' && form === '咖啡粉') ? grind : undefined,
    });
    
    // 簡單的成功提示 (之後可以改成漂亮的 Toast)
    alert(`已將 ${quantity} 件 ${product.name} 加入購物車！`);
  };

  return (
    <div className="bg-stone-50 p-6 rounded-xl mb-8 border border-stone-200">
      
      {/* 1. 選擇規格 (200g vs 濾掛) */}
      <div className="mb-5">
        <span className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wide">選擇規格</span>
        <div className="flex gap-3">
          {['200g', '濾掛(10入)'].map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold border transition-all ${
                variant === v 
                  ? 'bg-stone-800 text-white border-stone-800 shadow-md' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 只有選 200g 時：顯示「豆/粉」選項 */}
      {variant === '200g' && (
        <div className="mb-5 animate-fadeIn">
          <span className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wide">型態</span>
          <div className="flex gap-3">
            {['咖啡豆', '咖啡粉'].map((f) => (
              <button
                key={f}
                onClick={() => setForm(f as any)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold border transition-all ${
                  form === f 
                    ? 'bg-stone-600 text-white border-stone-600' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 只有選 咖啡粉 時：顯示「研磨粗細」下拉選單 */}
      {variant === '200g' && form === '咖啡粉' && (
        <div className="mb-5 animate-fadeIn">
          <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wide">研磨粗細</label>
          <div className="relative">
            <select 
              value={grind}
              onChange={(e) => setGrind(e.target.value as any)}
              className="w-full p-3 rounded-lg border border-stone-300 bg-white text-stone-700 appearance-none focus:ring-2 focus:ring-stone-500 outline-none"
            >
              <option value="手沖">手沖 (中研磨)</option>
              <option value="美式">美式咖啡機 (中細研磨)</option>
              <option value="義式">義式機 (細研磨)</option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-stone-500">▼</div>
          </div>
        </div>
      )}

      {/* 4. 數量與總價 */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-200">
        <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))} 
            className="px-4 py-2 hover:bg-stone-100 active:bg-stone-200 transition-colors"
          >-</button>
          <span className="px-4 py-2 font-bold text-stone-800 min-w-[3rem] text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)} 
            className="px-4 py-2 hover:bg-stone-100 active:bg-stone-200 transition-colors"
          >+</button>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400 mb-1">小計</p>
          <p className="text-2xl font-bold text-amber-700">NT$ {currentPrice * quantity}</p>
        </div>
      </div>

      {/* 5. 加入購物車按鈕 */}
      <button 
        onClick={handleAddToCart}
        className="w-full mt-6 bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-700 transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
      >
        <span>加入購物車</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      </button>
      
      <p className="text-center text-xs text-stone-400 mt-4">
        * 滿 $1000 免運費，未滿運費 $60
      </p>
    </div>
  );
}