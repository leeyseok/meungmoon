"use client"

import { Card, CardContent } from "@/components/ui/shacdn/card"
import { Skeleton } from "@/components/ui/shacdn/skeleton"
import React from "react"

const SummarySkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Card className={"bg-content border-border"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="bg-gray-300 h-4 w-24" />
            <Skeleton className="bg-gray-300 h-8 w-32" />
            <Skeleton className="bg-gray-300 h-4 w-64" />
          </div>
          <Skeleton className="bg-gray-300 h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
};
export default React.memo(SummarySkeleton);


