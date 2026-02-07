import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🔥 請再次確認這裡填的是剛剛那個「會成功」的正確網址
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxUUFWG7qor8QlozK6Jjvi1MYRhFoKvnUhRhm2BSDGQ3GKD9g9_YXiXLhC2WKtUB69U/exec'; 

    // 轉發資料給 Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Google API 回應錯誤: ${response.status}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('訂單處理失敗:', error);
    // 為了不讓客人看到程式錯誤，我們統一回傳「伺服器忙碌中」
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}