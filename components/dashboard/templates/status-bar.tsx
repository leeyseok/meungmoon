"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/shacdn/card";
import { Button } from "@/components/ui/shacdn/button";
import { Calendar } from "lucide-react";
import { PERIOD_OPTIONS } from "@/constants/dashboard";

interface StatusBarProps {
  isDarkMode: boolean;
  lastSync: Date | null;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const StatusBar = ({
  isDarkMode,
  lastSync,
  selectedPeriod,
  onPeriodChange,
}: StatusBarProps) => {
  return (
    <Card className={"bg-content border-border"}>
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div
          className={`flex items-center gap-4 text-sm ${
            isDarkMode ? "text-gray-400" : "text-muted-foreground"
          }`}
        >
          <span>
            마지막 동기화:{" "}
            {lastSync
              ? new Date(lastSync).toLocaleString("ko-KR")
              : "로딩 중..."}
          </span>
          <span className="hidden md:inline">
            • 마우스 휠로 확대/축소 • Ctrl+드래그로 이동
          </span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Calendar
              className={`h-4 w-4 ${
                isDarkMode ? "text-gray-400" : "text-muted-foreground"
              }`}
            />
            <div className="flex gap-1">
              {PERIOD_OPTIONS.map((period) => (
                <Button
                  key={period.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onPeriodChange(period.value)}
                  className={`h-8 px-3 text-xs cursor-pointer border-border text-text hover:text-white
                   ${
                     selectedPeriod === period.value
                       ? "bg-accent text-white"
                       : "hover:bg-accent-hover"
                   }`}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default React.memo(StatusBar);
