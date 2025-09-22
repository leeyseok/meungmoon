import { TrendingUp, TrendingDown } from "lucide-react"
import type { PriceData, TrendComparison, ThemeColors, TrendIcon } from "@/components/dashboard/types/dashboard"
import { PERIOD_LABELS } from "@/constants/dashboard"

export const getFilteredData = (data: PriceData[], selectedPeriod: string): PriceData[] => {
  // データ期間でフィルタリング
  const now = new Date()
  let startDate: Date

  switch (selectedPeriod) {
    case "1w":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "1m":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "3m":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case "6m":
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      break
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    case "5y":
      startDate = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000)
      break
    default: // "all"
      return data
  }

  return data.filter((item) => new Date(item.date) >= startDate)
}

// PriceData[] から期間比較を算出
export const getPeriodComparisonFromPrices = (data: PriceData[]): TrendComparison => {
  if (data.length < 2) return { change: 0, percentage: 0, trend: "neutral" }
  const first = data[0].price_meso_per_mepo
  const last = data[data.length - 1].price_meso_per_mepo
  const change = last - first
  const percentage = first === 0 ? 0 : (change / first) * 100
  const trend: TrendComparison["trend"] = change > 0 ? "up" : change < 0 ? "down" : "neutral"
  return { change, percentage, trend }
}

// PriceData[] から直近日のトレンドを算出
export const calculateTrendFromPrices = (data: PriceData[]): "up" | "down" | "neutral" => {
  if (data.length < 2) return "neutral"
  const prev = data[data.length - 2].price_meso_per_mepo
  const latest = data[data.length - 1].price_meso_per_mepo
  return latest > prev ? "up" : latest < prev ? "down" : "neutral"
}

export const getTrendIcon = (trend: string): TrendIcon => {
  switch (trend) {
    case "up":
      return { icon: TrendingUp, color: "text-green-500" }
    case "down":
      return { icon: TrendingDown, color: "text-red-500" }
    default:
      return { icon: TrendingUp, color: "text-muted-foreground" }
  }
}

export const getThemeColors = (isDarkMode: boolean): ThemeColors => {
  // 新パレットに基づくカラー設定（70/25/5 の役割にマッピング）
  // Light palette: primary #606c38, secondary #283618, accent #fefae0, warning #dda15e, highlight #bc6c25
  // Dark palette:  primary #0a0908, secondary #22333b, accent #eae0d5, warning #c6ac8f, highlight #5e503f
  if (isDarkMode) {
    return {
      chartLine: "#eae0d5", // accent
      chartBackground: "rgba(234, 224, 213, 0.08)",
      iconColor: "text-white/80",
      tooltipBg: "#22333b", // content
      tooltipText: "#eae0d5",
      tooltipBorder: "rgba(234, 224, 213, 0.3)",
    }
  }
  // light
  return {
    chartLine: "#283618", // secondary
    chartBackground: "rgba(40, 54, 24, 0.08)",
    iconColor: "text-[var(--color-content)]",
    tooltipBg: "#ffffff",
    tooltipText: "#283618",
    tooltipBorder: "#283618",
  }
}

export const formatPrice = (value: number): string => `${Math.round(value).toLocaleString("ko-KR")}원`

export const getPeriodLabel = (period: string): string => {
  return PERIOD_LABELS[period] || "전체"
}
