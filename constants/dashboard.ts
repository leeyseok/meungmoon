
import type { PeriodOption } from "@/components/dashboard/types/dashboard"

export const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "1주", value: "1w" },
  { label: "1달", value: "1m" },
  { label: "3달", value: "3m" },
  { label: "6달", value: "6m" },
  { label: "1년", value: "1y" },
  { label: "전체", value: "all" },
]

export const PERIOD_LABELS: { [key: string]: string } = {
  "1w": "1주",
  "1m": "1달",
  "3m": "3달",
  "6m": "6달",
  "1y": "1년",
  all: "전체",
}
