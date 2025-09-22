import type React from "react"
export interface PriceData {
  price_meso_per_mepo: number
  date: string
}

export interface PeriodOption {
  label: string
  value: string
}

export interface TrendComparison {
  change: number
  percentage: number
  trend: "up" | "down" | "neutral"
}

export interface ThemeColors {
  chartLine: string
  chartBackground: string
  iconColor: string
  tooltipBg: string
  tooltipText: string
  tooltipBorder: string
}

export interface TrendIcon {
  icon: React.ComponentType<{ className?: string }>
  color: string
}
