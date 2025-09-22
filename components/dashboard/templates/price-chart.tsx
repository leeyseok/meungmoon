"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shacdn/card";
import { BarChart3, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
// zoom 플러그인은 SSR에서 window를 참조하므로 클라이언트에서만 로드
const zoomPlugin =
  typeof window !== "undefined"
    ? require("chartjs-plugin-zoom").default
    : undefined;
import type {
  PriceData,
  ThemeColors,
} from "@/components/dashboard/types/dashboard";
import React, { useRef } from "react";
import { Button } from "@/components/ui/shacdn/button";

// クライアント時のみプラグイン登録
if (typeof window !== "undefined") {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  if (zoomPlugin) ChartJS.register(zoomPlugin);
}

// ssr에서는 비활성화
const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
  ssr: false,
});

interface PriceChartProps {
  isDarkMode: boolean;
  filteredData: PriceData[];
  themeColors: ThemeColors;
}

const PriceChart = ({
  isDarkMode,
  filteredData,
  themeColors,
}: PriceChartProps) => {
  // 차트 참조 (줌 리셋용)
  const chartRef = useRef<any>(null);

  const averageChartData = {
    labels: filteredData.map((item) =>
      new Date(item.date).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "평균 가격 (메포당)",
        data: filteredData.map((item) => item.price_meso_per_mepo),
        borderColor: themeColors.chartLine,
        backgroundColor: themeColors.chartBackground,
        borderWidth: 3,
        pointBackgroundColor: themeColors.chartLine,
        pointBorderColor: themeColors.chartLine,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
      },
    ],
  };

  // Y축 최소, 최대값 설정
  const prices = filteredData.map((d) => d.price_meso_per_mepo);
  const yMax = prices.length ? Math.ceil(Math.max(...prices)) : undefined;
  const yMin = prices.length ? Math.ceil(Math.min(...prices)) : undefined;
  // 줌, 패닝 제어 (데이터가 2개 이상일 때만 활성화)
  const canZoom = filteredData.length >= 2;
  const maxIndex = Math.max(0, filteredData.length - 1);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    normalized: true,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: themeColors.tooltipBg,
        titleColor: themeColors.tooltipText,
        bodyColor: themeColors.tooltipText,
        borderColor: themeColors.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const data = filteredData[dataIndex];
            const date = new Date(data?.date || "")
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\./g, "-")
              .replace(/-$/, "");
            return `날짜: ${date}`;
          },
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const data = filteredData[dataIndex];
            return `메이플포인트: ${Math.round(
              data?.price_meso_per_mepo || 0
            ).toLocaleString("ko-KR")}원`;
          },
        },
      },
      ...(typeof window !== "undefined"
        ? {
            zoom: {
              zoom: {
                wheel: { enabled: canZoom, speed: 0.1 },
                pinch: { enabled: canZoom },
                mode: "x",
              },
              pan: { enabled: canZoom, mode: "x", modifierKey: "ctrl" },
              limits: { x: { min: 0, max: maxIndex, minRange: 1 } },
            },
          }
        : {}),
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? "white" : "hsl(var(--muted-foreground))",
          font: {
            size: 12,
          },
          maxTicksLimit: 10,
        },
      },
      y: {
        min: yMin,
        max: yMax,
        grid: {
          color: "hsl(var(--border) / 0.3)",
        },
        ticks: {
          color: isDarkMode ? "white" : "hsl(var(--muted-foreground))",
          font: {
            size: 12,
          },
          callback: (value: number | string) =>
            `${Math.round(Number(value)).toLocaleString("ko-KR")}원`,
        },
      },
    },
  } as unknown as ChartOptions<"line">;

  return (
    <Card className={"bg-content border-border"}>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className={`flex items-center gap-2 text-text`}>
            <BarChart3 className={`h-5 w-5`} />
            평균 가격 추이
          </CardTitle>
          <CardDescription
            className={` ${isDarkMode ? "text-gray-400" : "text-text"}`}
          >
            메포 구매가와 판매가의 평균 가격 변동 추이
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => chartRef.current?.resetZoom?.()}
          className="border-border
            text-text hover:text-white
            hover:bg-accent-hover"  
        >
          <RotateCcw className="h-4 w-4 mr-1" /> 초기화
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Line
            ref={chartRef}
            data={averageChartData}
            options={chartOptions}
            className=""
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default React.memo(PriceChart);
