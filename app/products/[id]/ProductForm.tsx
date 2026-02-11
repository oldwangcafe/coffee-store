'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface ProductOption {
  variant: string;
  price: number;
}

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  options?: ProductOption[];
}

const GRIND_OPTIONS = [
  "細研磨 (義式濃縮)",
  "中細研磨 (摩卡壺)",
  "中研磨 (手沖/美式)",
  "中粗研磨 (聰明濾杯)",
  "粗研磨 (法式濾壓)"
];

export default function ProductForm({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  // 1. 規格選擇 (預設第一個)
  const [selectedOption, setSelectedOption] = useState<ProductOption>(
    product.options && product.options.length > 0 
      ? product.options[0] 
      : { variant: '標準包裝', price: product.price }
  );

  // 2. 型態選擇
  const [form, setForm] = useState<'咖啡豆' | '咖啡粉'>('咖啡豆');

  // 3. 研磨度選擇
  const [grind, setGrind] = useState('中研磨 (手沖/美式)');

  // 4. 數量選擇 (新增功能)
  const [quantity, setQuantity] = useState(1);

  // 判斷是否為濾掛
  const isDripBag = selectedOption.variant.includes('濾掛') || selectedOption.variant.includes('掛耳');

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedOption.price,
      image: product.image,
      quantity: quantity, // 使用客人選擇的數量
      variant: selectedOption.variant,
      form: isDripBag ? '無' : form,
      grind: isDripBag || form === '咖啡豆' ? undefined : grind
    });

    const btn = document.getElementById('add-btn');
    if(btn) {
       const originalText = btn.innerText;
       btn.innerText = "已加入購物車！";
       setTimeout(() => btn.innerText = originalText, 1000);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      
      {/* 1. 選擇規格 (按鈕列) */}
      {product.options && product.options.length > 1 && (
        <div>
          <p className="text-sm font-bold text-stone-600 mb-2">選擇規格</p>
          <div className="flex flex-wrap gap-3">
            {product.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(opt)}
                className={`px-6 py-3 text-sm font-bold rounded-lg border transition-all ${
                  selectedOption.variant === opt.variant
                    ? 'bg-stone-800 text-white border-stone-800 shadow-md' // 選中：深黑底白字
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400' // 未選：白底
                }`}
              >
                {opt.variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. 選擇型態 (按鈕列 - 只有非濾掛顯示) */}
      {!isDripBag && (
        <div className="animate-fade-in">
          <p className="text-sm font-bold text-stone-600 mb-2">型態</p>
          <div className="flex gap-3">
            <button
              onClick={() => setForm('咖啡豆')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg border transition-all ${
                form === '咖啡豆'
                  ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              咖啡豆
            </button>
            <button
              onClick={() => setForm('咖啡粉')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg border transition-all ${
                form === '咖啡粉'
                  ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              咖啡粉 (需研磨)
            </button>
          </div>
        </div>
      )}

      {/* 3. 研磨組細 (下拉選單 - 只有選咖啡粉顯示) */}
      {!isDripBag && form === '咖啡粉' && (
        <div className="animate-fade-in">
          <p className="text-sm font-bold text-stone-600 mb-2">研磨組細</p>
          <div className="relative">
            <select
              value={grind}
              onChange={(e) => setGrind(e.target.value)}
              className="w-full p-4 border border-stone-300 rounded-lg text-stone-900 font-bold bg-white focus:ring-2 focus:ring-stone-500 outline-none appearance-none cursor-pointer text-base"
              style={{ color: '#1c1917' }} // 強制深黑色字體
            >
              {GRIND_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-stone-900 font-medium">
                  {opt}
                </option>
              ))}
            </select>
            {/* 自訂箭頭 icon，讓它看起來更有質感 */}
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-stone-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 4. 數量與價格區塊 */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-6">
        {/* 數量選擇器 */}
        <div className="flex items-center border border-stone-300 rounded-lg h-12">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 h-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
          >
            -
          </button>
          <input 
            type="text" 
            readOnly 
            value={quantity} 
            className="w-12 h-full text-center text-stone-900 font-bold outline-none border-x border-stone-300"
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 h-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
          >
            +
          </button>
        </div>

        {/* 總價顯示 */}
        <div className="text-right">
          <p className="text-xs text-stone-400 mb-1">小計</p>
          <p className="text-3xl font-extrabold text-amber-700 font-mono">
            NT$ {selectedOption.price * quantity}
          </p>
        </div>
      </div>

      {/* 5. 加入購物車按鈕 */}
      <div>
        <button
          id="add-btn"
          onClick={handleAddToCart}
          className="w-full bg-stone-900 text-white text-lg font-bold py-4 rounded-xl hover:bg-stone-800 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          加入購物車
        </button>
        <p className="text-center text-xs text-stone-400 mt-3">
          * 滿 $1000 免運費，未滿運費 $60
        </p>
      </div>
    </div>
  );
}