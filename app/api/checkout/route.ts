import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ✅ 改回來：從環境變數讀取
    const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GAS_URL;

    // 防呆檢查：如果忘記設環境變數，會在終端機警告
    if (!GOOGLE_SCRIPT_URL) {
      console.error("❌ 錯誤：找不到 NEXT_PUBLIC_GAS_URL 環境變數");
      throw new Error("伺服器設定錯誤");
    }

    console.log("正在發送到 GAS..."); // 為了安全，我們不印出完整網址

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    // ... 下面維持原樣 ...
    if (!response.ok) {
       throw new Error(`GAS HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    // 檢查 GAS 內部的邏輯錯誤
    if (result.success === false) {
       throw new Error(result.error || "GAS 內部錯誤");
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}