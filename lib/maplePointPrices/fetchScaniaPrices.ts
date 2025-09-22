'use server';
import type { PriceData } from '@/components/dashboard/types/dashboard';
import { readSheet } from '@/lib/google-sheets';

export async function fetchMaplePointPrices(): Promise<PriceData[]> {
  // 시트 탭 이름!범위를 정확히 지정
  const values = await readSheet('메이플포인트가격!A:B');
  // 데이터만 추출 (A3,B3부터)
  const dataRows = values.slice(2);

  const data: PriceData[] = [];
  for (const row of dataRows) {
    const priceRaw = (row[0] ?? '').trim(); // A열
    const dateRaw  = (row[1] ?? '').trim(); // B열
    if (!priceRaw || !dateRaw) continue;

    // onEdit로 yyyy-MM-dd를 값으로 찍고 있다면 안전하게 파싱됨
    const d = new Date(dateRaw);
    if (isNaN(d.getTime())) continue;

    // 数値に正規化（カンマ等を除去）
    const priceNumber = Number(priceRaw.replace(/,/g, ''));
    if (!Number.isFinite(priceNumber)) continue;

    data.push({
      price_meso_per_mepo: priceNumber,
      date: d.toISOString(),
    });
  }
  return data;
}