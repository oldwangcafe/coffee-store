import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const storeId = formData.get('storeid') as string;
    const storeName = formData.get('storename') as string;
    const storeAddress = formData.get('storeaddress') as string;

    console.log('🏪 收到 7-11 回傳:', { storeId, storeName });

    const requestUrl = new URL(request.url);
    const redirectUrl = new URL('/checkout', requestUrl.origin);
    
    if (storeId) redirectUrl.searchParams.set('storeId', storeId);
    if (storeName) redirectUrl.searchParams.set('storeName', storeName);
    
    // 🔥 修改重點：加上 { status: 303 }
    // 303 會強制瀏覽器把 POST 轉成 GET，這樣就不會報錯了！
    return NextResponse.redirect(redirectUrl, { status: 303 });

  } catch (error) {
    console.error('7-11 Callback Error:', error);
    return NextResponse.json({ error: '處理門市資料失敗' }, { status: 500 });
  }
}