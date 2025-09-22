"use client";
import React from "react";
import ChartSkeleton from "@/components/dashboard/skeleton/ChartSkeleton";
import SummarySkeleton from "@/components/dashboard/skeleton/SummarySkeleton";
import { useDashboardControl } from "@/components/dashboard/hooks/useDashboardControl";
import DashboardHeader from "@/components/dashboard/templates/dashboard-header";
import StatusBar from "@/components/dashboard/templates/status-bar";
import PriceChart from "@/components/dashboard/templates/price-chart";
import PriceSummaryCard from "@/components/dashboard/templates/price-summary-card";
// import { ServerSelector } from "@/components/server-selector";

const DashboardPage = () => {
  const {
    isDarkMode,
    isRefreshing,
    isLoading,
    selectedPeriod,
    lastSync,
    filteredData,
    periodComparison,
    averageTrendIcon,
    periodTrendIcon,
    themeColors,
    handleRefresh,
    handleToggleTheme,
    handlePeriodChange,
  } = useDashboardControl();

  return (
    <div
      className={`min-h-screen p-4 md:p-6 bg-surface ${isDarkMode ? "dark" : ""}`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader
          isDarkMode={isDarkMode}
          isRefreshing={isRefreshing}
          onToggleTheme={handleToggleTheme}
          onRefresh={handleRefresh}
        />

        <StatusBar
          isDarkMode={isDarkMode}
          lastSync={lastSync}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {!isLoading ? (
          <PriceChart
            isDarkMode={isDarkMode}
            filteredData={filteredData}
            themeColors={themeColors}
          />
        ) : (
          <ChartSkeleton isDarkMode={isDarkMode} />
        )}

        <div className="grid gap-4 md:grid-cols-1">
          {!isLoading ? (
            <PriceSummaryCard
              isDarkMode={isDarkMode}
              filteredData={filteredData}
              selectedPeriod={selectedPeriod}
              periodComparison={periodComparison}
              periodTrendIcon={periodTrendIcon}
              averageTrendIcon={averageTrendIcon}
              themeColors={themeColors}
            />
          ) : (
            <SummarySkeleton isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(DashboardPage);
