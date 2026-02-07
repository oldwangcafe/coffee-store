import { PRODUCTS } from '../../data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FlavorRadarChart from './FlavorRadarChart';
// 🔥 1. 引入剛剛做好的購買表單
import ProductForm from './ProductForm';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return { title: '找不到商品' };
  }

  return {
    title: `${product.name} | 隔壁老王咖啡`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 左側：大圖 */}
          <div className="h-96 md:h-full bg-stone-200 relative min-h-[500px]">
             <img 
               src={product.imageUrl} 
               alt={product.name} 
               className="w-full h-full object-cover"
             />
             <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 px-3 py-1 rounded text-sm font-bold text-stone-800 shadow-sm inline-block self-start">
                  {product.roastLevel}
                </span>
                <span className="bg-stone-900/90 px-3 py-1 rounded text-sm font-bold text-white shadow-sm inline-block self-start">
                  {product.process}
                </span>
             </div>
          </div>

          {/* 右側：詳細資訊 */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="text-sm text-amber-700 font-bold mb-2 uppercase tracking-widest">
              {product.country} · {product.region}
            </div>
            <h1 className="text-4xl font-extrabold text-stone-900 mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
               {product.flavorNotes.map(note => (
                 <span key={note} className="px-3 py-1 bg-amber-50 text-amber-800 text-sm font-medium rounded-full border border-amber-100">
                   {note}
                 </span>
               ))}
            </div>

            <div className="mb-6 border-b border-stone-100 pb-6">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">風味分析</h3>
              <FlavorRadarChart data={product.flavorProfile} />
            </div>

            <h3 className="text-lg font-bold text-stone-800 mb-2">杯測筆記</h3>
            <p className="text-stone-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            {/* 🔥 2. 這裡原本是一堆 HTML，現在只要放這一行元件，程式碼變得超乾淨！ */}
            <ProductForm product={product} />

          </div>
        </div>
      </div>
    </div>
  );
}