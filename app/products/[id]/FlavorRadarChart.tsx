'use client'; // 這是 Client Component

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function FlavorRadarChart({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-stone-50 rounded-xl text-stone-400 text-sm">
        此豆種尚無風味數據
      </div>
    );
  }

  const chartData = [
    { subject: '酸度', A: data.acidity, fullMark: 5 },
    { subject: '甜度', A: data.sweetness, fullMark: 5 },
    { subject: '苦度', A: data.bitterness, fullMark: 5 },
    { subject: '厚度', A: data.body, fullMark: 5 },
    { subject: '餘韻', A: data.aftertaste, fullMark: 5 },
  ];

  return (
    <div className="w-full h-[300px] -ml-6">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 14, fontWeight: 'bold' }} />
          <Radar name="Flavor" dataKey="A" stroke="#d97706" strokeWidth={3} fill="#d97706" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}