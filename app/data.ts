export type RoastLevel = '淺焙' | '中焙' | '中深焙' | '深焙';

export interface CoffeeProduct {
  id: string;
  name: string;
  country: string;
  region: string;
  process: string;
  roastLevel: RoastLevel;
  price: number;
  flavorNotes: string[];
  description: string;
  imageUrl: string;
  // 🔥 這裡定義了雷達圖需要的結構
  flavorProfile: {
    acidity: number;
    sweetness: number;
    bitterness: number;
    body: number;
    aftertaste: number;
  };
}

export const PRODUCTS: CoffeeProduct[] = [
  {
    id: '1',
    name: '衣索比亞 耶加雪菲 沃卡',
    country: '衣索比亞',
    region: '耶加雪菲',
    process: '水洗',
    roastLevel: '淺焙',
    price: 450,
    flavorNotes: ['柑橘', '茉莉花', '蜂蜜'],
    description: '經典的耶加雪菲風味，酸值明亮，口感乾淨。入口時可以感受到豐富的花香氣息，尾韻帶有蜂蜜的甜感。',
    imageUrl: '/coffee-beans/yirgacheffe.jpg',
    // 🔥 這裡補上了第 1 號豆的分數
    flavorProfile: {
      acidity: 5,
      sweetness: 4,
      bitterness: 1,
      body: 2,
      aftertaste: 4
    }
  },
  {
    id: '2',
    name: '哥倫比亞 天堂莊園',
    country: '哥倫比亞',
    region: '考卡',
    process: '雙重厭氧',
    roastLevel: '中焙',
    price: 550,
    flavorNotes: ['草莓優格', '熱帶水果', '酒香'],
    description: '強烈的特殊處理法風味，適合喜歡嚐鮮的你。雙重厭氧發酵帶來了爆炸性的草莓與優格香氣。',
    imageUrl: '/coffee-beans/colombia.jpg',
    // 🔥 這裡補上了第 2 號豆的分數
    flavorProfile: {
      acidity: 4,
      sweetness: 5,
      bitterness: 2,
      body: 3,
      aftertaste: 5
    }
  },
  {
    id: '3',
    name: '印尼 黃金曼特寧',
    country: '印尼',
    region: '蘇門答臘',
    process: '濕剝法',
    roastLevel: '深焙',
    price: 400,
    flavorNotes: ['仙草', '黑巧克力', '奶油'],
    description: '厚實醇厚，不酸的老饕首選。經過三次手選的黃金曼特寧，口感乾淨且帶有濃郁的藥草與巧克力尾韻。',
    imageUrl: '/coffee-beans/mandheling.jpg',
    // 🔥 這裡補上了第 3 號豆的分數
    flavorProfile: {
      acidity: 1,
      sweetness: 3,
      bitterness: 5,
      body: 5,
      aftertaste: 4
    }
  }
];