"use client";

import { Button } from "@/components/ui/shacdn/button";
import { Badge } from "@/components/ui/shacdn/badge";
import { RefreshCw, Database, Moon, Sun } from "lucide-react";
import React from "react";

interface DashboardHeaderProps {
  isDarkMode: boolean;
  isRefreshing: boolean;
  onToggleTheme: () => void;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isDarkMode,
  isRefreshing,
  onToggleTheme,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className={`font-heading text-3xl font-bold md:text-4xl ${
            isDarkMode ? "text-white" : "text-foreground"
          }`}
        >
          메웅문온라인
        </h1>
        <p
          className={`${
            isDarkMode ? "text-gray-400" : "text-muted-foreground"
          }`}
        >
          MapleStory 메포 시세 대시보드
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onToggleTheme}
          variant="outline"
          size="sm"
          className={`gap-2 border-border cursor-pointer
            text-text hover:text-white
            hover:bg-accent-hover
          `}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {isDarkMode ? "라이트" : "다크"}
        </Button>
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className={`gap-2 border-border cursor-pointer
            text-text hover:text-white
            hover:bg-accent-hover
          `}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          새로고침
        </Button>
      </div>
    </div>
  );
};
export default React.memo(DashboardHeader);
