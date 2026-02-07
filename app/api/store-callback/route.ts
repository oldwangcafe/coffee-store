import { NextResponse } from 'next/server';

// 7-11 會用 POST 方法把資料傳回來
export async function POST(request: Request) {
  try {
    // 1. 讀取 7-11 傳回來的表單資料 (x-www-form-urlencoded)
    const formData = await request.formData();
    const storeId = formData.get('storeid') as string;
    const storeName = formData.get('storename') as string;
    const storeAddress = formData.get('storeaddress') as string;

    console.log('🏪 收到 7-11 回傳:', { storeId, storeName });

    // 2. 準備要跳轉回結帳頁面的網址
    // 我們把店家資料放在網址參數 (Query Params) 裡帶回去
    const requestUrl = new URL(request.url);
    const redirectUrl = new URL('/checkout', requestUrl.origin);
    
    if (storeId) redirectUrl.searchParams.set('storeId', storeId);
    if (storeName) redirectUrl.searchParams.set('storeName', storeName);
    // 有些店名會包含特殊字元，編碼一下比較安全
    
    // 3. 使用 302 Redirect 把使用者帶回結帳頁面
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('7-11 Callback Error:', error);
    return NextResponse.json({ error: '處理門市資料失敗' }, { status: 500 });
  }
}