// app/api/checkout/route.ts
import { NextResponse } from 'next/server';

const getGasUrl = () => {
  const url = process.env.NEXT_PUBLIC_GAS_URL;
  if (!url) {
    console.error("❌ 嚴重錯誤: 找不到 NEXT_PUBLIC_GAS_URL 環境變數");
    throw new Error('未設定環境變數');
  }
  return url;
};

// 處理 GET 請求 (查單、看菜單)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const phone = searchParams.get('phone');
    
    const GAS_URL = getGasUrl();
    let targetUrl = `${GAS_URL}?action=${action}`;
    if (phone) targetUrl += `&phone=${phone}`;

    console.log(`📡 正在連線到 GAS: ${action}`); // Debug 用

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`GAS 回應錯誤: ${response.status}`);
    }

    // 🔥 關鍵檢查：Google 有時候會回傳 HTML (例如權限不足時的登入頁)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const text = await response.text();
      console.error("❌ GAS 回傳了 HTML 錯誤頁 (可能是權限設定錯誤):", text.substring(0, 100)); // 只印前100字
      throw new Error("系統連線錯誤 (GAS Permission Error)");
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('API 代理失敗:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 處理 POST 請求 (結帳)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const GAS_URL = getGasUrl();

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
       throw new Error("GAS 回傳了 HTML，請檢查部署設定 (所有人可存取)");
    }

    if (!response.ok) throw new Error(`GAS HTTP Error: ${response.status}`);
    
    const result = await response.json();
    if (result.success === false) throw new Error(result.error || "GAS 內部錯誤");

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('訂單處理失敗:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}