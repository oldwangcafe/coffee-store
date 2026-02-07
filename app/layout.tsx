import type { Metadata } from 'next';
// 如果你的專案有字型設定 (如 Inter)，請保留原本的 import，沒有的話這行可忽略
import { Inter } from 'next/font/google'; 
import './globals.css';
// 🔥 1. 引入 Navbar 元件
import Navbar from './components/Navbar';

// 🔥 1. 引入我們剛寫好的購物車 Provider
import { CartProvider } from './context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '隔壁老王咖啡',
  description: '自家烘焙 · 新鮮直送 · 堅持品質',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        {/* 🔥 2. 用 Provider 把整個網站的內容 (children) 包起來 */}
        {/* 這樣做，網站裡的任何一頁 (children) 都能隨時存取購物車資料 */}
        <CartProvider>
          {/* 🔥 3. 放上 Navbar */}
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}