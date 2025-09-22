import type { PriceData } from "@/components/dashboard/types/dashboard"

export const generateMockData = (): PriceData[] => {
  const data: PriceData[] = []
  const basePrice = 2590 // 기준 가격 2590원
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 1달 전부터 시작

  for (let i = 0; i < 30; i++) {
    // 30일 일일 데이터
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)

    // 현실적인 가격 변동 (±5% 범위)
    const variation = (Math.random() - 0.5) * 0.1 // -5% ~ +5%
    const priceVariation = basePrice * variation

    const averagePrice = Math.round(basePrice + priceVariation)

    data.push({
      date: currentDate.toISOString(),
      price_meso_per_mepo: averagePrice,
    })
  }

  return data
}
