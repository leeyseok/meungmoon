"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/shacdn/card"
import { Skeleton } from "@/components/ui/shacdn/skeleton"
import React from "react"

const ChartSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Card className={"bg-content border-border"}>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <Skeleton className="bg-gray-300 h-5 w-40" />
          <Skeleton className="mt-2 bg-gray-300 h-4 w-64" />
        </div>
        <Skeleton className="bg-gray-300 h-8 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="bg-gray-300 h-[400px] w-full" />
      </CardContent>
    </Card>
  )
};
export default React.memo(ChartSkeleton);


