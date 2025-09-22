import { Card, CardContent } from "@/components/ui/shacdn/card"
import type { PriceData, TrendComparison, TrendIcon, ThemeColors } from "@/components/dashboard/types/dashboard"
import { formatPrice, getPeriodLabel } from "@/lib/dashboard-utils"
import SummarySkeleton from "@/components/dashboard/skeleton/SummarySkeleton"
import React from "react"

interface PriceSummaryCardProps {
  isDarkMode: boolean
  filteredData: PriceData[]
  selectedPeriod: string
  periodComparison: TrendComparison
  periodTrendIcon: TrendIcon
  averageTrendIcon: TrendIcon
  themeColors: ThemeColors
  isLoading?: boolean
}

const PriceSummaryCard = ({
  isDarkMode,
  filteredData,
  selectedPeriod,
  periodComparison,
  periodTrendIcon,
  averageTrendIcon,
  themeColors,
}: PriceSummaryCardProps) => {

  return (
    <Card className={"bg-content border-border"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-[var(--maple-brown)]/70"}`}>
              {filteredData.length > 0 ? "금일 평균가격" : "평균 가격"}
            </p>
            <p className={`text-3xl font-bold text-[var(--maple-brown)] dark:text-[var(--maple-white)]`}>
              {filteredData.length > 0 ? formatPrice(filteredData[filteredData.length - 1].price_meso_per_mepo) : formatPrice(0)}
            </p>
            {filteredData.length > 1 && (
              <div className="flex items-center gap-2 mt-2">
                <periodTrendIcon.icon className={`h-4 w-4 ${periodTrendIcon.color}`} />
                <span className={`text-sm font-medium ${periodTrendIcon.color}`}>
                  {getPeriodLabel(selectedPeriod)} 기준일 대비 {Math.abs(periodComparison.percentage).toFixed(2)}%(
                  {formatPrice(Math.abs(periodComparison.change))}){" "}
                  {periodComparison.trend === "up" ? "상승" : periodComparison.trend === "down" ? "하락" : "변동없음"}
                </span>
              </div>
            )}
          </div>
          <averageTrendIcon.icon className={`h-8 w-8 ${averageTrendIcon.color} opacity-60`} />
        </div>
      </CardContent>
    </Card>
  )
};
export default React.memo(PriceSummaryCard);