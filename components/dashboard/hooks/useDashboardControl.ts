"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getFilteredData,
  getPeriodComparisonFromPrices,
  calculateTrendFromPrices,
  getTrendIcon,
  getThemeColors,
} from "@/lib/dashboard-utils";
import type { PriceData } from "@/components/dashboard/types/dashboard";


export const useDashboardControl = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1w");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 필터링된 데이터
  const filteredData = useMemo(
    () => getFilteredData(prices, selectedPeriod),
    [prices, selectedPeriod]
  );

  // 기간 비교 데이터（PriceData[] ベース）
  const periodComparison = useMemo(
    () => getPeriodComparisonFromPrices(filteredData),
    [filteredData]
  );

  // 추세 아이콘（PriceData[] ベース）
  const averageTrendIcon = useMemo(() => {
    const trend = calculateTrendFromPrices(filteredData);
    return getTrendIcon(trend);
  }, [filteredData]);

  // 기간 추세 아이콘
  const periodTrendIcon = useMemo(
    () => getTrendIcon(periodComparison.trend),
    [periodComparison]
  );

  // 테마 색상
  const themeColors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode]);

  // 가격 데이터 가져오기기
  const loadPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/maplePointPrices`, { cache: "no-store" });
      if (!res.ok) throw new Error("failed to fetch prices");
      const json: PriceData[] = await res.json();
      setPrices(json);
    } catch (err) {
      toast.error("가격 데이터를 불러오지 못했습니다.");
    }
    finally {
      setLastSync(new Date());
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  // 핸들러 그룹
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    toast.loading("데이터를 새로고침하는 중...", { id: "refresh-data" });
    await loadPrices();
    setIsRefreshing(false);
    toast.success(`데이터가 성공적으로 업데이트되었습니다!`, {
      id: "refresh-data",
      description: `마지막 동기화: ${new Date().toLocaleString("ko-KR")}`,
    });
  }, [loadPrices]);

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  return {
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
  };
};

export type UseDashboardControlReturn = ReturnType<typeof useDashboardControl>;


