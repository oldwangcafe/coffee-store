import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar'; 
import { CartProvider } from './context/CartContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '隔壁老王咖啡',
  description: '職人的手沖咖啡',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        {/* 🔥 重點：CartProvider 要包住 所有人 (包含 Navbar) */}
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}